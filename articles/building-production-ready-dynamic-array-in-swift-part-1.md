---
title: 'Under the Hood: Building a Production-Ready DynamicArray in Swift - Part 1'
date: '2025-09-24'
description: 'A deep dive into building a Swift Array from scratch using manual memory management, unsafe pointers, and preparing for Copy-on-Write semantics.'
---

# Under the Hood: Building a Production-Ready DynamicArray in Swift

As Staff Engineers, we shouldn’t just use Swift’s tools—we should understand how they work. Swift’s Array is a value-type struct that delivers high performance and ergonomic APIs. How?

A big part of the “magic” is a careful mix of manual memory management and Copy-on-Write (COW). In this walk-through, we’ll implement our own DynamicArray from scratch, touching unsafe pointers, memory layout, and COW, then round it out so it behaves like a proper Swift collection.

⸻

## Part 1: The Foundation — A Simple, _naïve_ approach

Before we get fancy, let’s write the smallest thing that could possibly work: a tiny, growable array that we manage by hand. This first pass—SimpleArray—owns a typed, uninitialized memory block, tracks a count and capacity, lets us append, index with subscript, and remove the last element. It will work and it will be fast… but it deliberately has two big problems we’ll face head-on in later parts.

## We have to start somewhere

We start by building the first components of our array. At a minimum, an array needs: **a storage area**, **a count of initialized elements**, and **a capacity** (how many elements it can hold before growing). In this first pass we set up exactly those pieces—nothing more—so we can see the shape of the problem before we solve it.

```swift
public struct SimpleArray<Element> {
  public private(set) var count: Int
  public private(set) var capacity: Int
  // Typed, uninitialized storage for `capacity` elements.
  private var buffer: UnsafeMutablePointer<Element>

  public init(initialCapacity: Int = 1) {
    let capacity = max(1, initialCapacity)
    self.buffer = .allocate(capacity: capacity) // typed, uninitialized memory
    self.count = 0
    self.capacity = capacity
  }
```

- `allocate(capacity:)` - get a typed, uninitialized block. 
When we create the array, we need contiguous storage for Element.
`buffer = .allocate(capacity: capacity)` gives us a pointer to typed but uninitialized memory. From this moment on, we are responsible for initializing, deinitializing, and eventually freeing it.

## Appending elements: make the array actually store values

An array’s job is to hold elements in order. Appending places a new value in the next uninitialized slot and increments the count:

```swift
public mutating func append(_ element: Element) {
    (buffer + count).initialize(to: element)
    count += 1
}
```

> `initialize(to:)` — write the first value into an uninitialized slot.
In append, the next position (buffer + count) is **uninitialized**. `initialize(to:)` constructs an Element in-place there for the first time.
(If we used plain assignment pointee = value here, we’d be assigning into **uninitialized** memory—undefined behavior. Assignment is only for **already-initialized** slots, e.g., subscript setter.)

What happens when count reaches capacity? Writing again would run past the end of our allocation—undefined behavior. The fix is to grow the storage before the write. A simple and effective policy is to **double the capacity** whenever we’re full, which yields amortized O(1) appends: resizes are infrequent, and most appends cost constant time.

```swift
private mutating func resizeIfNeeded() {
  // If there's still space, we're done.
  guard count >= capacity else {
    return
  }  

  // Double the capacity to keep appends amortized O(1).
  let newCapacity = max(1, capacity * 2)  
  let newPointer = UnsafeMutablePointer<Element>.allocate(capacity: newCapacity)

  // Move-initialize the initialized prefix into the new block.
  newPointer.moveInitialize(from: buffer, count: count)

  // The old block now contains uninitialized bits; free it.
  buffer.deallocate()  

  buffer = newPointer
  capacity = newCapacity
}
```

> `moveInitialize(from:count:)` — move elements during a resize.\
>A contiguous block can’t grow in place. When we run out of space, we:
> - allocate a new, larger block, since the original allocation can’t be expanded in place
> - move-initialize the existing, initialized prefix into the new block, and
> - free the old block. \
> `moveInitialize` transfers the elements and leaves the **source** memory uninitialized, which avoids double-destroys and can reduce ARC traffic compared to copying.

> `deallocate()` — release the old block.
> Once we’ve moved everything to the new block, the old pointer’s region contains **no initialized elements**. It’s safe (and necessary) to call deallocate() to return that memory to the allocator.

Now, anytime we want to append a new element we check if the array needs resizing.

```swift
public mutating func append(_ element: Element) {
  resizeIfNeeded()
  (buffer + count).initialize(to: element)
  count += 1
}
```

## Removing elements: removeLast and popLast

Arrays don’t just grow—they also shrink. The cheapest removal is from the end: no shifting, just take the last value and mark that slot as free.

```swift
// Remove and return the last element.
@discardableResult
public mutating func removeLast() -> Element {
  precondition(count > 0, "removeLast on empty SimpleArray")
  count -= 1
  // Move out the element, which returns the value and leaves the
  // memory at this slot uninitialized.
  return (buffer + count).move()
}

public mutating func popLast() -> Element? {
  guard !isEmpty else {
    return nil
  }
  return removeLast()
}
```

> `move()` reads the value and deinitializes the memory at that location in one operation. After move():
> - You get the element as a returned value.
> - The slot is now uninitialized (safe to overwrite on the next append).
> - There’s no risk of double-destroying the element’s resources (important if Element holds references or other managed state).

This is exactly what we want: our count tracks how many elements are initialized. By decrementing count first and then calling move() on (buffer + count), we ensure that:
- The initialized region is always the half-open range [0, count).
- Deinitialization matches initialization 1:1, so deinitialize(count:) in cleanup is correct.
- The freed slot won’t be read again until it’s explicitly reinitialized.

`popLast()` is the non-throwing, optional-returning variant: it returns nil if the array is empty, whereas removeLast() traps with a clear precondition message.

## Indexed access with subscript

An array’s superpower is O(1) random access—reach any element directly by its index. In Swift, that’s expressed with subscript. We include a bounds check to keep access safe, then read or write the value at that slot.

```swift
// Indexed access. Reads/writes an already-initialized slot.
public subscript(index: Int) -> Element {
  get {
    precondition(index >= 0 && index < count, "Index out of bounds")
    return (buffer + index).pointee
  }
  set {
    precondition(index >= 0 && index < count, "Index out of bounds")
    (buffer + index).pointee = newValue
  }
}
```
> `.pointee` is how you read or write the value stored at a typed pointer. Think of it as the Swift equivalent of *ptr in C.
> **Not for uninitialized memory**: If the slot hasn’t been initialized yet, **don’t** use .pointee = .... Use initialize(to:) instead.

## Quick Checks: isEmpty and last

While count gives us the exact number of elements, we often need simpler checks: Is the array empty? What's the last element without removing it? These convenience getters provide quick, safe ways to query the array's state.

```swift
public var isEmpty: Bool {
  count == 0
}

// Peek at the last element.
public var last: Element? {
  guard count > 0 else {
    return nil
  }
  // Access the element at 'count - 1' (the last initialized slot).
  return (buffer + (count - 1)).pointee
}
```

`isEmpty` directly exposes whether count is zero, offering a more readable conditional check. `last` safely returns an optional, allowing you to peek at the final element without altering the array, leveraging the same pointee access we use for subscripts.

## Tearing it down: destroy() and deinitialize

Our SimpleArray is a struct, which means there’s **no deinit**. Nothing runs automatically when the value goes out of scope. To avoid leaks in this simple version, we expose a manual teardown method: destroy().

```swift 
// This MUST be called by the user before the value goes out of scope,
// otherwise elements won't be deinitialized and the memory won't be freed.
public mutating func destroy() {
  // Deinitialize only the initialized prefix, then free the block.
  buffer.deinitialize(count: count)
  buffer.deallocate()
  // After this point, using the array is undefined.
  count = 0
  capacity = 0
}
```

>`deinitialize(count:)` runs the destructor (if any) for each initialized element and marks that memory as uninitialized again.
>  - For reference types, this releases their retains.
>  - For value types with resources, this runs their deinit.
>  - For trivial types (e.g., Int), it’s effectively a no-op—but still correct to call.

> `deallocate()` returns the raw block to the allocator. After this, the pointer is invalid.

Calling `destroy()` more than once, or using the array after destroy(), is undefined behavior. Setting count/capacity to 0 at the end helps catch accidental use, but doesn’t make it safe.

## Pitfalls

### Cleanup: structs don’t have deinit

SimpleArray is a struct, so it has no deinit. When it goes out of scope, Swift does not automatically tear down manually allocated memory (UnsafeMutablePointer.allocate). If you don’t explicitly deinitialize the elements and deallocate the block, you leak both the storage and any resources the elements hold. In the example below, each Tracker should print a message from its deinit, but because we never call destroy(), those destructors are never run—the references remain retained inside the un-deinitialized buffer, and the allocation itself is never freed. In Part 2, we fix this by moving ownership to a small heap Buffer class that does have a deinit, so cleanup becomes automatic.

```swift
final class Tracker {
  let id: Int
  init(_ id: Int) { self.id = id }
  deinit { print("Tracker \(id) deinitialized") }
}

do {
  var a = SimpleArray<Tracker>()
  a.append(Tracker(1))
  a.append(Tracker(2))
  // We forget to call a.destroy()
} // Scope ends… but no "deinitialized" prints => leaked storage & elements
```

### Value semantics: copying just copies the pointer

Copying a struct that contains a raw pointer **does not** copy the pointee data—it copies the pointer value. Both instances now alias the same buffer. Any mutation through one instance is visible through the other, breaking the expectation that value types have independent state after a copy. The demonstration below shows `b[0] = 99` also changing `a[0]`. In Part 2, we restore true value semantics using **Copy-on-Write (COW)**: before any mutation, if the storage is shared, we make a unique deep copy of the buffer.

```swift
var a = SimpleArray<Int>()
a.append(10)
a.append(20)

var b = a        // Shallow copy: the pointer is duplicated, not the elements
b[0] = 99        // Mutate through 'b'

// Surprise: 'a' sees the change too, because both point to the same buffer.
print(a[0])  // 99
print(b[0])  // 99
```

## Full Code

```swift
import Foundation

public struct SimpleArray<Element> {
  public private(set) var count: Int
  public private(set) var capacity: Int
  
  public var isEmpty: Bool {
    count == 0
  }
  
  // Typed, uninitialized storage for `capacity` elements.
  private var buffer: UnsafeMutablePointer<Element>
  
  // Peek at the last element.
  public var last: Element? {
    guard count > 0 else {
      return nil
    }
    
    return (buffer + (count - 1)).pointee
  }
  
  public init(initialCapacity: Int = 1) {
    let capacity = max(1, initialCapacity)
    self.buffer = .allocate(capacity: capacity) // typed, uninitialized memory
    self.count = 0
    self.capacity = capacity
  }
  
  // Append with simple doubling growth.
  public mutating func append(_ element: Element) {
    resizeIfNeeded()
    (buffer + count).initialize(to: element)
    count += 1
  }
  
  // Indexed access. Reads/writes an already-initialized slot.
  public subscript(index: Int) -> Element {
    get {
      precondition(index >= 0 && index < count, "Index out of bounds")
      return (buffer + index).pointee
    }
    set {
      precondition(index >= 0 && index < count, "Index out of bounds")
      (buffer + index).pointee = newValue
    }
  }
  
  // Remove and return the last element.
  @discardableResult
  public mutating func removeLast() -> Element {
    precondition(count > 0, "removeLast on empty SimpleArray")
    count -= 1
    // Move out the element, which returns the value and leaves the
    // memory at this slot uninitialized.
    return (buffer + count).move()
  }
  
  public mutating func popLast() -> Element? {
    guard !isEmpty else {
      return nil
    }
    
    return removeLast()
  }
  
  private mutating func resizeIfNeeded() {
    guard count >= capacity else {
      return
    }
    
    var newCapacity = max(1, capacity * 2)
    
    let newPointer = UnsafeMutablePointer<Element>.allocate(capacity: newCapacity)
    // Move-initialize the initialized prefix into the new block.
    newPointer.moveInitialize(from: buffer, count: count)
    // Old block now contains uninitialized bits; just free it.
    buffer.deallocate()
    
    buffer = newPointer
    capacity = newCapacity
  }
  
  // This MUST be called by the user before the value goes out of scope,
  // otherwise elements won't be deinitialized and the memory won't be freed.
  public mutating func destroy() {
    // Deinitialize only the initialized prefix, then free the block.
    buffer.deinitialize(count: count)
    buffer.deallocate()
    // After this point, using the array is undefined.
    count = 0
    capacity = 0
  }
}
```