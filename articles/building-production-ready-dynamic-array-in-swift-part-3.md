---
title: "Under the Hood: Building a Production-Ready DynamicArray in Swift – Part 3"
date: "2025-10-31"
description: "Turning our value-semantic DynamicArray into a first-class Swift collection: protocol conformances, safe range replacement, and capacity planning."
is_hidden: false
---

# Under the Hood: Building a Production-Ready DynamicArray in Swift – Part 3

In Part II, we gave `DynamicArray` a private heap-backed storage class and implemented Copy-on-Write so the type behaves like a true Swift value. In this part, we build on that foundation to create a genuine Swift collection that integrates cleanly with the standard library and its powerful algorithms.

This write-up is a guided tour of the changes. We will build up the behavior with small, focused snippets, then show the full implementation at the end exactly as it appears in the codebase.

---

## Becoming a Real Collection

The foundation of any Swift `Collection` is its indices (`startIndex`, `endIndex`) and a subscript for element access. Since our storage is contiguous and supports constant-time indexing, we can conform to the more powerful `RandomAccessCollection` and `MutableCollection` protocols.

**`RandomAccessCollection`** binds the logical range of elements to `startIndex` and `endIndex` while promising O(1) index traversal and distance calculation:

```swift
extension DynamicArray: RandomAccessCollection {
  public var startIndex: Int {
    0
  }

  public var endIndex: Int {
    buffer.count
  }
}
```

**`MutableCollection`** adds writable element access via the subscript's `set` block. Every mutation must call our COW guard first to ensure that modifications to one `DynamicArray` value do not unintentionally affect another that shares the same storage. We use `precondition` to validate indices, which causes a crash in debug builds if an invalid index is used (a "fail fast" approach that surfaces misuse early in tests).

```swift
extension DynamicArray: MutableCollection {
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

The key takeaway is that by conforming to these protocols, our `DynamicArray` automatically gains access to a vast suite of algorithms from the standard library without changing how we manage memory under the hood.

---

## Capacity Planning

Uncontrolled, incremental growth is expensive. We expose a public API that mirrors Swift's `Array` so callers can plan allocations ahead of time, and we keep a fast-path for single-element appends.

**Public `reserveCapacity`** delegates to the storage buffer after enforcing COW, preventing a shared buffer from being resized unexpectedly:

```swift
public mutating func reserveCapacity(_ minimumCapacity: Int) {
  precondition(minimumCapacity >= 0, "minimumCapacity must be non-negative")
  updateBufferIfNeeded()
  buffer.resizeIfNeeded(minimumCapacity: minimumCapacity)
}
```

**Internal storage growth** uses geometric expansion (doubling the capacity) to achieve amortized O(1) appends. It also safely clamps the capacity at `Int.max` to prevent overflow:

```swift
func growIfFull() {
  guard count >= capacity else {
    return
  }
  let doubled = capacity <= (Int.max / 2) ? capacity * 2 : Int.max
  resizeIfNeeded(minimumCapacity: max(1, doubled))
}
```

This combination gives predictable performance for both bulk insertion workloads and steady streams of individual appends.

---

### A Deeper Look: Evolving `resizeIfNeeded`

In an earlier, simpler version of our `Buffer`, the resizing logic was tightly coupled to the idea of doubling for appends. It looked like this:

```swift
// An earlier, simpler version
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

This version works, but it has two major limitations:
1.  **It isn't flexible.** It can only double the current capacity. It can't satisfy an arbitrary request like `reserveCapacity(1000)` if the current capacity is only 16.
2.  **It isn't safe.** If `capacity` is very large (e.g., close to `Int.max`), `capacity * 2` will cause a fatal integer overflow.

To make this function production-ready and capable of supporting both `reserveCapacity` and internal growth, we evolved it into the version seen in the full implementation. The key changes are:

-   **Accepting a `minimumCapacity`:** The function now takes the target capacity as an argument, making it a general-purpose tool.
-   **Using a `while` loop:** Instead of a single multiplication, it repeatedly doubles the capacity *until* it satisfies the `minimumCapacity`. This correctly handles large, non-incremental capacity requests.
-   **Adding an overflow check:** Before doubling, it checks if the multiplication would exceed `Int.max`. If so, it safely clamps the capacity to the requested minimum (or `Int.max` in the `growIfFull` case), preventing a crash.

```swift
func resizeIfNeeded(minimumCapacity: Int) {
    precondition(minimumCapacity >= 0, "minimumCapacity must be non negative.")

    guard minimumCapacity > capacity else {
      return
    }

    var newCapacity = capacity
    while newCapacity < minimumCapacity {
      // Check for overflow before doubling
      if newCapacity > (Int.max / 2) {
        newCapacity = minimumCapacity   // clamp to the exact need
        break
      }
      newCapacity *= 2
    }

    let newPointer = UnsafeMutablePointer<Element>.allocate(capacity: newCapacity)
    newPointer.moveInitialize(from: pointer, count: count)

    // Deallocate the old pointer immediately after moving.
    // Note: We don't deinitialize because the elements were moved out.
    pointer.deallocate()

    pointer = newPointer
    capacity = newCapacity
  }
```

These enhancements transform the function from a simple internal helper into the robust, flexible core of our memory management strategy.

---

## Range Replacement: The Heart of Mutation

`RangeReplaceableCollection` unlocks high-level APIs like `insert`, `removeSubrange`, and `append(contentsOf:)`. The single method we must implement correctly is `replaceSubrange(_:with:)`. Doing this safely in a manually managed buffer requires a careful sequence of operations:

1) Materialize new elements if they could alias `self`.
2) Compute the size delta and the projected final count.
3) Ensure the buffer has enough capacity for the result.
4) Locate and shift the "tail" (elements after the replacement range) if needed.
5) Overwrite the region where the old and new ranges overlap.
6) Initialize any newly created space or deinitialize any removed space.
7) Publish the new count, making the change visible.

### 1) Materialize New Elements

This is a critical step to prevent aliasing issues. If `newElements` were a slice of the *same* `DynamicArray` we are modifying, mutating the underlying buffer while iterating over the slice would lead to undefined behavior and likely data corruption. By creating a new `Array` from the input, we guarantee the source of new elements is independent of the destination we are writing to.

```swift
let newElements = Array(newElements)
```

### 2) Compute Delta and Projected Count

We define `delta` as `numberOFElementsToAdd` minus `numberOfElementsToRemove`. A positive delta means the collection grows and we will shift the tail right. A negative delta means it shrinks and we shift the tail left.

```swift
let numberOfElementsToRemove = subrange.count
let numberOFElementsToAdd = newElements.count
let delta = numberOFElementsToAdd - numberOfElementsToRemove
let projectedCount = count + delta
```

### 3) Ensure Capacity

We resize the buffer up front so any right-shifts can safely target uninitialized memory. This is critical to correctly use memory-moving operations like `moveInitialize`.

```swift
buffer.resizeIfNeeded(minimumCapacity: projectedCount)
```

### 4) Tail Math and Shifting

The "tail" refers to all elements that come after the replaced subrange. These elements must be shifted to their new location.

```swift
let tailStartIndex = subrange.upperBound
let tailElementsCount = count - tailStartIndex
let newTailDestinationIndex = subrange.lowerBound + numberOFElementsToAdd
```

- If `delta > 0`, we are inserting more than we remove. The tail shifts right into a newly created, uninitialized region. We use `moveInitialize`, which is **overlap-safe** (like C's `memmove`) and correctly handles writing into uninitialized memory with a single, efficient call.

```swift
if delta > 0 {
  (buffer.pointer + newTailDestinationIndex).moveInitialize(
    from: buffer.pointer + tailStartIndex,
    count: tailElementsCount
  )
}
```

- If `delta < 0`, we are inserting fewer elements than we remove. The tail shifts left into already-initialized memory. We use `moveUpdate` for this case. Afterwards, we must deinitialize the trailing elements that are no longer part of the collection to avoid memory leaks.

```swift
if delta < 0 {
  (buffer.pointer + (tailStartIndex + delta)).moveUpdate(
    from: buffer.pointer + tailStartIndex,
    count: tailElementsCount
  )
  (buffer.pointer + projectedCount).deinitialize(count: -delta)
}
```

This entire shift operation is only necessary if a tail exists and its destination is different from its starting position:

```swift
if tailElementsCount > 0 && newTailDestinationIndex != tailStartIndex {
  // shift right or left as shown above
}
```

### 5) Overwrite the Overlap Region

The region where old and new elements overlap is a pure overwrite. We'll call this the `overwriteCount`, defined as `min(numberOFElementsToAdd, numberOfElementsToRemove)`. We can simply assign new values here because the memory slots remain initialized.

```swift
let overwriteCount = Swift.min(numberOFElementsToAdd, numberOfElementsToRemove)
for i in 0..<overwriteCount {
  (buffer.pointer + subrange.lowerBound + i).pointee = newElements[i]
}
```

### 6) Initialize the New Gap or Deinitialize the Tail

If we inserted more elements than we removed (`delta > 0`), we created a new gap between the overwritten elements and the newly shifted tail. This gap must be initialized with the remaining new elements:

```swift
if delta > 0 {
  for j in overwriteCount..<numberOFElementsToAdd {
    (buffer.pointer + subrange.lowerBound + j).initialize(to: newElements[j])
  }
}
```

If we removed more than we inserted (`delta < 0`), we already deinitialized the now-unused memory at the end of the buffer after performing the left shift (in step 4).

### 7) Publish the New Count

At the end of the operation, the region of initialized memory is exactly `0..<projectedCount`. We publish this change by updating the buffer’s count. This is the atomic step where the new logical length of the collection becomes visible to readers:

```swift
buffer.count = projectedCount
```

This sequence keeps memory in a valid state at all times, avoiding both undefined behavior and memory leaks, while remaining efficient for all three cases: growth, shrinkage, and equal-sized replacement.

*(Time Complexity: O(N) where N is the number of elements in the tail that must be shifted. Memory Complexity: O(1) additional storage, beyond any buffer reallocation.)*

---

## Polishing the Experience

A few final touches make the container ergonomic and behave like a first-class citizen in Swift.

-   **`ExpressibleByArrayLiteral`** provides essential syntactic sugar, allowing initialization like `let array: DynamicArray = [a, b, c]`. Our implementation pre-allocates the exact capacity needed, making it efficient.
-   **`CustomStringConvertible` and `CustomDebugStringConvertible`** make debugging and logging easier. Conforming to these provides a readable representation for printing, like `[1, 2, 3]`, and a more detailed developer-focused view, like `DynamicArray([1, 2, 3])`.
-   **`Equatable` and `Hashable`** (when `Element` conforms) are crucial for integration with the standard library. `Equatable` allows two `DynamicArray` instances to be compared with `==`, while `Hashable` allows the array to be used as a key in a `Dictionary` or stored in a `Set`. Our implementation includes a fast path that returns `true` immediately if two instances share the exact same underlying buffer.
-   **`swapAt`** is implemented with direct move semantics. A naive swap might create temporary copies. For reference types, this is a significant optimization as it avoids the double retain/release cycle that would occur with a naive temporary copy.

None of these change the core storage model. They are layered on top of the same COW and buffer management rules we already established.

---

## Full Implementation

Below is the complete implementation exactly as it appears in code. Spacing and formatting are preserved.

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

  func resizeIfNeeded(minimumCapacity: Int) {
    precondition(minimumCapacity >= 0, "minimumCapacity must be non negative.")

    guard minimumCapacity > capacity else {
      return
    }

    var newCapacity = capacity
    while newCapacity < minimumCapacity {
      // Check for overflow before doubling
      if newCapacity > (Int.max / 2) {
        newCapacity = minimumCapacity   // clamp to the exact need
        break
      }
      newCapacity *= 2
    }

    let newPointer = UnsafeMutablePointer<Element>.allocate(capacity: newCapacity)
    newPointer.moveInitialize(from: pointer, count: count)

    // Deallocate the old pointer immediately after moving.
    // Note: We don't deinitialize because the elements were moved out.
    pointer.deallocate()

    pointer = newPointer
    capacity = newCapacity
  }

  func growIfFull() {
    guard count >= capacity else {
      return
    }

    let doubled = capacity <= (Int.max / 2) ? capacity * 2 : Int.max
    resizeIfNeeded(minimumCapacity: max(1, doubled))
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
    buffer.growIfFull()
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
    guard !isEmpty else { return 
      nil 
    }

    return removeLast()
  }

  public mutating func reserveCapacity(_ minimumCapacity: Int) {
    precondition(minimumCapacity >= 0, "minimumCapacity must be non-negative")
    updateBufferIfNeeded() // CoW: don’t grow a shared buffer
    buffer.resizeIfNeeded(minimumCapacity: minimumCapacity)
  }
}

// RandomAccessCollection conformance
extension DynamicArray: RandomAccessCollection {
  public var startIndex: Int {
    0
  }

  public var endIndex: Int {
    buffer.count
  }
}

// MutableCollection conformance
extension DynamicArray: MutableCollection {
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

// RangeReplaceableCollection conformance
extension DynamicArray: RangeReplaceableCollection {
  public init() {
    self.init(initialCapacity: 1)
  }

  public mutating func replaceSubrange<C>(_ subrange: Range<Int>, with newElements: C) where C : Collection, Element == C.Element {
    precondition(subrange.lowerBound >= 0 && subrange.upperBound <= count, "range out of bounds")

    // If `newElements` is derived from `self` (e.g., a slice), iterating it lazily
    // while mutating our storage can corrupt data. Materialize first.
    let newElements = Array(newElements)

    updateBufferIfNeeded()

    let numberOfElementsToRemove = subrange.count
    let numberOFElementsToAdd = newElements.count
    let delta = numberOFElementsToAdd - numberOfElementsToRemove // >0: shift right, <0: shift left
    let projectedCount = count + delta

    buffer.resizeIfNeeded(minimumCapacity: projectedCount)

    // The tail being all elements after the upper bound of the newly inserted items.
    let tailStartIndex = subrange.upperBound
    // How many elements exist after the subrange you’re replacing.
    // This will be either positive or equal to 0 (the replaced slice touches the end)
    let tailElementsCount = count - tailStartIndex
    // The tail will now be at (newInsertion started + elements that where added).
    let newTailDestinationIndex = subrange.lowerBound + numberOFElementsToAdd

    // Shift tail if needed.
    if tailElementsCount > 0 && newTailDestinationIndex != tailStartIndex {
      // Shift Right: move backward into uninitialized space (overlap-safe).
      if delta > 0 {
        (buffer.pointer + newTailDestinationIndex).moveInitialize(
          from: buffer.pointer + tailStartIndex,
          count: tailElementsCount
        )
      } else if delta < 0 {
        // Shift Left: move tail forward into already-initialized memory.
        (buffer.pointer + (tailStartIndex + delta)).moveUpdate(
          from: buffer.pointer + tailStartIndex,
          count: tailElementsCount
        )
      }
    }

    // Replace as many elements as the overlap between removed and inserted.
    let overwriteCount = Swift.min(numberOFElementsToAdd, numberOfElementsToRemove)
    for i in 0..<overwriteCount {
      (buffer.pointer + subrange.lowerBound + i).pointee = newElements[i]
    }

    // After shifting tail right, we must initialize the gap [lowerBound + overwriteCount ..< newTailDestinationIndex].
    if delta > 0 {
      for j in overwriteCount..<numberOFElementsToAdd {
        (buffer.pointer + subrange.lowerBound + j).initialize(to: newElements[j])
      }
    }

    // We must deinitialize the extra spots after shifting tail left
    // Otherwise we risk leaks with nontrivial types.
    if delta < 0 {
      (buffer.pointer + projectedCount).deinitialize(count: -delta)
    }

    // Finalize: now the initialized region is exactly [0, projectedCount).
    buffer.count = projectedCount
  }
}

// MARK: - ExpressibleByArrayLiteral

extension DynamicArray: ExpressibleByArrayLiteral {
  /// Creates a `DynamicArray` from an array literal.
  ///
  /// Capacity is pre-reserved to avoid intermediate reallocations.
  public init(arrayLiteral elements: Element...) {
    self.init(initialCapacity: Swift.max(1, elements.count))

    guard !elements.isEmpty else {
      return
    }

    elements.withUnsafeBufferPointer { sourceBuffer in
      buffer.pointer.initialize(from: sourceBuffer.baseAddress!, count: sourceBuffer.count)
      buffer.count = sourceBuffer.count
    }
  }
}

// MARK: - CustomStringConvertible / CustomDebugStringConvertible

extension DynamicArray: CustomStringConvertible, CustomDebugStringConvertible {
  /// Human-readable collection representation, e.g. `[1, 2, 3]`.
  public var description: String {
    var first = true
    var s = "["
    for x in self {
      if !first { s += ", " } else { first = false }
      s += String(describing: x)
    }
    s += "]"
    return s
  }

  /// Debug representation including the type name, e.g. `DynamicArray[1, 2, 3]`.
  public var debugDescription: String {
    "DynamicArray\(description)"
  }
}

// MARK: - Equatable (element-wise) when Element is Equatable

extension DynamicArray: Equatable where Element: Equatable {
  /// Two `DynamicArray`s are equal when they have the same count and
  /// each pair of elements compares equal in order.
  public static func == (lhs: Self, rhs: Self) -> Bool {
    // Fast path: if buffers are identical, they are equal.
    if lhs.buffer === rhs.buffer { 
      return true 
    }

    guard lhs.count == rhs.count else {
      return false
    }

    // Walk pointers directly for speed
    var i = 0
    while i < lhs.count {
      if (lhs.buffer.pointer + i).pointee != (rhs.buffer.pointer + i).pointee {
        return false
      }
      i += 1
    }
    return true
  }
}

// MARK: - Hashable when Element is Hashable

extension DynamicArray: Hashable where Element: Hashable {
  /// Hashes elements in order (same semantics as `Array`).
  public func hash(into hasher: inout Hasher) {
    hasher.combine(count)
    var i = 0
    while i < count {
      hasher.combine((buffer.pointer + i).pointee)
      i += 1
    }
  }
}

// MARK: - swapAt override (fast path)

extension DynamicArray {
  /// Swaps the elements at the given indices using move semantics.
  ///
  /// This avoids intermediate retains/releases compared to assigning into
  /// initialized memory for reference types, and it keeps ARC traffic low.
  public mutating func swapAt(_ i: Int, _ j: Int) {
    precondition(i >= 0 && i < count && j >= 0 && j < count, "Index out of bounds")
    if i == j {
      return
    }

    updateBufferIfNeeded()

    // Ensure i < j so the sequence of moves is clear (not strictly required).
    let (a, b) = i < j ? (i, j) : (j, i)
    let pointer = buffer.pointer

    // Move out a -> temp (slot a becomes uninitialized)
    let temp = (pointer + a).move()
    // Move b into a (slot b becomes uninitialized; a re-initialized)
    (pointer + a).initialize(to: (pointer + b).move())
    // Initialize b from temp (slot b re-initialized)
    (pointer + b).initialize(to: temp)
  }
}
```

---

## What Comes Next

So far, we have built a robust, value-semantic collection that behaves correctly. However, the ultimate payoff for managing our own contiguous buffer is raw performance, especially for bulk operations. The standard library provides a powerful mechanism for this, and it's time to unlock it.

In Part IV, we will implement `withContiguousStorageIfAvailable` and its mutable counterpart, `withMutableContiguousStorageIfAvailable`. These methods are the hooks that allow high-performance algorithms to bypass the collection's public interface and get direct, unsafe pointer access to its underlying memory. This is the "fast path" that makes Swift's own `Array` so efficient.

By implementing these methods, we will:
-   Allow our `DynamicArray` to interoperate efficiently with other collections and C APIs.
-   Enable massive performance gains for operations like `append(contentsOf:)` when the source is another contiguous collection.
-   Discuss the critical invariants we must uphold to safely expose our buffer, especially in the context of Copy-on-Write.
