---
title: 'Under the Hood: Building a Production-Ready DynamicArray in Swift - Part 2'
date: '2025-09-29'
description: 'Solving memory leaks and broken value semantics by introducing a heap-allocated Buffer class with deinit and implementing true Copy-on-Write (COW).'
is_hidden: false
---

# Under the Hood: Building a Production-Ready DynamicArray in Swift - II

In <a href="../insights/building-production-ready-dynamic-array-in-swift-part-1" target="_blank">Part 1</a>, we built `SimpleArray`, a minimal dynamic array that worked but had two critical flaws: it required manual memory cleanup via a `destroy()` method, and it broke Swift’s value semantics because copying the struct only copied the pointer, not the data. These aren't just academic problems—they lead to memory leaks and unpredictable behavior in real applications.

Now, we’ll fix them. We’re going to elevate our `SimpleArray` into a more robust `DynamicArray`. The solution lies in a classic Swift pattern: a value-type `struct` managing a heap-allocated `class` instance. This gives us the best of both worlds: the automatic cleanup of a class `deinit` and the value semantics we expect, enforced by Copy-on-Write (COW).

⸻

## Part 2: Automatic Cleanup and True Value Semantics

Our strategy is to separate the *management* of the array (the struct) from the *storage* (a new, private class). This class, which we'll call `Buffer`, will be the sole owner of the `UnsafeMutablePointer` and will be responsible for all memory operations.

### Step 1: Solving Cleanup with a `Buffer` Class

The fundamental problem with `SimpleArray` was that a `struct` has no `deinit`. When a `SimpleArray` value went out of scope, its manually allocated memory was leaked unless we remembered to call `destroy()`.

A `class`, on the other hand, *does* have a `deinit`. It’s the perfect place to centralize our memory management. Let’s create a `Buffer` class that holds the pointer, count, and capacity.

```swift
fileprivate final class Buffer<Element> {
  var count: Int
  var capacity: Int
  var pointer: UnsafeMutablePointer<Element>

  init(initialCapacity: Int) {
    let capacity = max(1, initialCapacity)
    self.pointer = .allocate(capacity: capacity)
    self.count = 0
    self.capacity = capacity
  }

  // The magic happens here!
  deinit {
    // Deinitialize only the initialized part of the buffer.
    pointer.deinitialize(count: count)
    // Return the raw memory to the system.
    pointer.deallocate()
  }
}
```

> `deinit` — The automatic cleanup crew.
> When the last strong reference to a class instance is removed, its `deinit` method is called automatically. By moving our cleanup logic from the manual `destroy()` method into `Buffer`’s `deinit`, we guarantee that our memory will be deinitialized and deallocated correctly. No more manual calls, no more leaks.

Now, our `DynamicArray` struct will be much simpler. It just needs to hold a reference to a `Buffer` instance.

```swift
public struct DynamicArray<Element> {
  // Our storage is now a reference to a heap-allocated Buffer.
  private var buffer: Buffer<Element>

  // Properties are now computed, forwarding to the buffer.
  public var count: Int {
    buffer.count
  }
  
  public var capacity: Int {
    buffer.capacity
  }

  public init(initialCapacity: Int = 1) {
    self.buffer = Buffer(initialCapacity: initialCapacity)
  }
}
```
With this change, our first problem is solved. When a `DynamicArray` goes out of scope, its `buffer` property is released. If that was the last reference to the `Buffer` instance, ARC calls `deinit`, and our memory is cleaned up perfectly. We can completely remove the `destroy()` method.

```swift
final class Tracker {
  let id: Int
  init(_ id: Int) { self.id = id }
  deinit { print("Tracker \(id) deinitialized") }
}

do {
  var a = DynamicArray<Tracker>() // Our new array
  a.append(Tracker(1))
  a.append(Tracker(2))
  // No need to call destroy() anymore!
} // Scope ends...
// Prints:
// "Tracker 1 deinitialized"
// "Tracker 2 deinitialized"
```
Success! The leaks are gone.

### Step 2: Restoring Value Semantics with Copy-on-Write (COW)

We’ve fixed cleanup, but we still have the value semantics problem. When we copy a `DynamicArray`, we copy its `buffer` reference, meaning both structs point to the *same* heap-allocated storage.

```swift
var a = DynamicArray<Int>()
a.append(10)
var b = a      // Both 'a' and 'b' now reference the SAME Buffer instance.
b.append(20)   // This mutation will be visible via 'a' as well.
print(a.count) // Prints 2. That's not what we expect from a value type!
```

The solution is **Copy-on-Write (COW)**. The rule is simple: before performing any *mutation*, check if the buffer is shared. If it is, make a unique copy of it first.

Swift gives us a fantastic tool for this: `isKnownUniquelyReferenced`. It checks if a class instance has exactly one strong reference.

> `isKnownUniquelyReferenced(_:)` — The cornerstone of COW.
> This function takes a class instance as an `inout` parameter and returns `true` if there is exactly one strong reference to it. It’s an ARC primitive that allows us to safely and efficiently check if our buffer is shared without incrementing its reference count.

Let’s implement a method in our `DynamicArray` that performs this check and copies the buffer if needed.

>**Thread-Safety Note**
The implementation shown here assumes single-threaded use. `isKnownUniquelyReferenced` checks uniqueness under ARC but is not a synchronization primitive; it does not make mutations atomic or safe across threads. If the same DynamicArray instance can be mutated from multiple threads/tasks, you must add external synchronization (e.g., protect mutations with a lock or a serial queue), or enforce isolation (e.g., wrap the array in an actor and perform mutations inside the actor). Swift’s standard Array isn’t “magically” data-race free either—safe concurrent use still requires coordinatio

```swift
// Inside DynamicArray<Element>
private mutating func updateBufferIfNeeded() {
  // If the buffer is uniquely referenced, we're free to mutate it.
  // Otherwise, we need to create a copy for ourselves.
  if !isKnownUniquelyReferenced(&buffer) {
    buffer = buffer.copy()
  }
}
```

This method relies on a new `copy()` method in our `Buffer` class. This method will allocate a new buffer and copy the existing elements into it.

```swift
// Inside Buffer<Element>
func copy() -> Buffer<Element> {
  // Create a new buffer with at least enough capacity.
  let newBuffer = Buffer<Element>(initialCapacity: self.capacity)

  // Copy-initialize the new buffer's memory from our initialized elements.
  newBuffer.pointer.initialize(from: self.pointer, count: self.count)
  
  // Set the count on the new buffer.
  newBuffer.count = self.count

  return newBuffer
}
```

> `initialize(from:count:)` — The copy-initializer.
> Unlike `moveInitialize`, which transfers ownership and leaves the source uninitialized, `initialize(from:count:)` performs a true copy. Each element from the source is copied into the destination’s uninitialized memory. The source buffer remains completely valid and untouched.

### Step 3: Integrating COW and Centralizing Logic

Now we have all the pieces. The final step is to call `updateBufferIfNeeded()` at the beginning of every `mutating` method in `DynamicArray`. This ensures that any time we are about to change the array's state, we guarantee we have a unique copy of the storage.

Let’s also take this opportunity to clean up our architecture. Since the `Buffer` is now the "engine" of our array, let’s move the core logic like `resizeIfNeeded`, `append`, `removeLast`, and subscripting into it. The `DynamicArray` struct will become a simple, clean facade.

First, let's move `resizeIfNeeded` into `Buffer`:
```swift
// Inside Buffer<Element>
func resizeIfNeeded() {
  guard count >= capacity else {
    return
  }
  let newCapacity = max(1, capacity * 2)
  let newPointer = UnsafeMutablePointer<Element>.allocate(capacity: newCapacity)
  newPointer.moveInitialize(from: pointer, count: count)
  pointer.deallocate()
  pointer = newPointer
  capacity = newCapacity
}
```

Now, let's update our `DynamicArray` methods. Notice how `updateBufferIfNeeded()` is the first call in every mutation.

```swift
// Inside DynamicArray<Element>

public mutating func append(_ element: Element) {
  updateBufferIfNeeded()
  buffer.resizeIfNeeded() // The buffer now manages its own growth.
  (buffer.pointer + buffer.count).initialize(to: element)
  buffer.count += 1
}

@discardableResult
public mutating func removeLast() -> Element {
  precondition(!isEmpty, "removeLast on empty array")
  updateBufferIfNeeded()
  buffer.count -= 1
  return (buffer.pointer + buffer.count).move()
}

public subscript(index: Int) -> Element {
  get {
    precondition(index >= 0 && index < count, "Index out of bounds")
    return (buffer.pointer + index).pointee
  }
  set {
    precondition(index >= 0 && index < count, "Index out of bounds")
    updateBufferIfNeeded()
    (buffer.pointer + index).pointee = newValue
  }
}
```
With this, our `DynamicArray` now behaves exactly as a Swift user would expect. Copying is a cheap, constant-time operation (just copying a reference), and mutations on a copy don't affect the original.

Let's re-run our test from earlier:
```swift
var a = DynamicArray<Int>()
a.append(10)

// 1. Copy 'a' to 'b'. Both now share the same Buffer instance.
//    isKnownUniquelyReferenced(&a.buffer) is now false.
var b = a

// 2. We try to mutate 'b'.
//    'b.append()' calls updateBufferIfNeeded().
//    The check !isKnownUniquelyReferenced(&b.buffer) is TRUE.
//    'b' creates a new, unique copy of the buffer for itself.
b.append(99)

// 3. The change is isolated to 'b'. 'a' is unaffected.
print(a.count) // 1
print(b.count) // 2
print(a[0])    // 10
print(b[0])    // 10
print(b[1])    // 99
```
Perfect. We've achieved true value semantics with optimal performance.

### What's Next

We’ve built a robust foundation. Our `DynamicArray` now has automatic memory management and correct value semantics. It's fast, safe, and much closer to a production-ready collection. In Part 3, we'll polish it off by conforming to Swift's `Collection` and related protocols, making it a first-class citizen in the Swift ecosystem that works seamlessly with algorithms, loops, and standard library functions.

## Full Code

Here is the complete code for our `DynamicArray` and its private `Buffer` after the changes in Part 2.

```swift
import Foundation

// The storage engine. A private, heap-allocated class that owns the memory.
fileprivate final class Buffer<Element> {
  var count: Int
  var capacity: Int
  var pointer: UnsafeMutablePointer<Element>

  init(initialCapacity: Int) {
    let capacity = max(1, initialCapacity)
    self.pointer = .allocate(capacity: capacity)
    self.count = 0
    self.capacity = capacity
  }

  deinit {
    // Deinitialize the initialized elements and deallocate the memory.
    pointer.deinitialize(count: count)
    pointer.deallocate()
  }

  // Creates a new buffer and copies the existing elements into it.
  func copy() -> Buffer<Element> {
    let newBuffer = Buffer<Element>(initialCapacity: self.capacity)
    newBuffer.pointer.initialize(from: self.pointer, count: self.count)
    newBuffer.count = self.count
    return newBuffer
  }
  
  func resizeIfNeeded() {
    guard count >= capacity else {
      return
    }
    
    let newCapacity = max(1, capacity * 2)
    let newPointer = UnsafeMutablePointer<Element>.allocate(capacity: newCapacity)
    newPointer.moveInitialize(from: pointer, count: count)
    
    // Deallocate the old pointer immediately after moving.
    // Note: We don't deinitialize because the elements were moved out.
    pointer.deallocate()
    
    pointer = newPointer
    capacity = newCapacity
  }
}

public struct DynamicArray<Element> {
  private var buffer: Buffer<Element>

  public init(initialCapacity: Int = 1) {
    self.buffer = Buffer(initialCapacity: initialCapacity)
  }

  // A private mutating function to enforce Copy-on-Write.
  private mutating func updateBufferIfNeeded() {
    if !isKnownUniquelyReferenced(&buffer) {
      buffer = buffer.copy()
    }
  }

  // MARK: - Public API

  public var count: Int {
    buffer.count
  }

  public var capacity: Int {
    buffer.capacity
  }

  public var isEmpty: Bool {
    count == 0
  }

  public var last: Element? {
    guard !isEmpty else {
      return nil
    }
    return (buffer.pointer + (count - 1)).pointee
  }
  
  public mutating func append(_ element: Element) {
    updateBufferIfNeeded()
    buffer.resizeIfNeeded()
    (buffer.pointer + buffer.count).initialize(to: element)
    buffer.count += 1
  }

  @discardableResult
  public mutating func removeLast() -> Element {
    precondition(!isEmpty, "removeLast on empty array")
    updateBufferIfNeeded()
    buffer.count -= 1
    return (buffer.pointer + buffer.count).move()
  }
  
  public mutating func popLast() -> Element? {
    guard !isEmpty else { return nil }
    return removeLast()
  }

  public subscript(index: Int) -> Element {
    get {
      precondition(index >= 0 && index < count, "Index out of bounds")
      return (buffer.pointer + index).pointee
    }
    set {
      precondition(index >= 0 && index < count, "Index out of bounds")
      updateBufferIfNeeded()
      (buffer.pointer + index).pointee = newValue
    }
  }
}
```
