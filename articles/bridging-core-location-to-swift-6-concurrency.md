---
title: 'Bridging CoreLocation to Swift 6 Concurrency'
date: '2024-11-11'
description: 'How to bridge CoreLocation to Swift 6 Concurrncy model, and what are the problems and how to solve them.'
---

# Bridging CoreLocation to Swift 6's Concurrency: Challenges and Solutions

> The full code including current location, current auth status, and continuous streams of them, can be found here: https://gist.github.com/TheInkedEngineer/a7c6f5db954460abf87ec34474c73927

Swift’s modern concurrency model, introduced with Swift 5.5, provides powerful tools like async/await and AsyncStream, enabling developers to write more readable and maintainable asynchronous code. However, integrating these features with existing frameworks like `CoreLocation`, which rely on delegate patterns, can be challenging.

In this article, we’ll explore how to bridge `CoreLocation`’s delegate-based API to Swift’s concurrency model. We’ll discuss the challenges faced during this process and the solutions to overcome them, highlighting the nuances introduced by strict concurrency in Swift 6.

## The Traditional Delegate Pattern in `CoreLocation`

`CoreLocation` traditionally uses the delegate pattern to provide location updates. Developers subclass NSObject, conform to CLLocationManagerDelegate, and implement delegate methods to receive location data.

### Implementing Location Updates with Delegates

Here’s how you might traditionally implement a LocationManager to get the current location and be notified when it changes:

```
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    var didUpdateLocations: (([CLLocation]) -> Void)?

    override init() {
        super.init()
        locationManager.delegate = self
    }

    func requestLocationAuthorization() {
        locationManager.requestWhenInUseAuthorization()
    }

    func startUpdatingLocation() {
        locationManager.startUpdatingLocation()
    }

    func stopUpdatingLocation() {
        locationManager.stopUpdatingLocation()
    }

    // MARK: - CLLocationManagerDelegate Methods

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        didUpdateLocations?(locations)
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        // Handle error
    }

    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        // Handle authorization changes
    }
}
```

### Consuming LocationManager in a SwiftUI View

To use this LocationManager in a SwiftUI view, you set up the manager and handle updates via the callback:

```
import SwiftUI

struct ContentView: View {
    @StateObject private var locationManager = LocationManager()
    @State private var currentLocation: CLLocation?

    var body: some View {
        VStack {
            if let location = currentLocation {
                Text("Location: \(location.coordinate.latitude), \(location.coordinate.longitude)")
            } else {
                Text("Fetching location...")
            }

            Button("Start Updating Location") {
                locationManager.requestLocationAuthorization()
                locationManager.startUpdatingLocation()
            }

            Button("Stop Updating Location") {
                locationManager.stopUpdatingLocation()
            }
        }
        .onAppear {
            locationManager.didUpdateLocations = { locations in
                if let location = locations.last {
                    currentLocation = location
                }
            }
        }
    }
}
```

### Limitations of the Traditional Approach

While the traditional approach works, there are some limitations:
- **Not Leveraging Swift Concurrency**: The delegate pattern and callback closures don’t take advantage of Swift’s modern concurrency features like async/await, which can make asynchronous code harder to read and maintain.
- **Complex Asynchronous Flow**: Managing asynchronous operations with delegates and closures can become complex, especially when handling multiple asynchronous tasks or chaining operations.
- **Threading Considerations**: Delegate methods and callbacks may not be called on the main thread, requiring manual dispatching to update UI elements safely.

Our solution addresses these limitations by replacing the closure-based callback mechanism with a modern concurrency-based alternative using async/await and AsyncStream. This approach simplifies asynchronous code, improves readability, and aligns with Swift’s concurrency model, making it easier to manage asynchronous flows within SwiftUI views.

By adopting Swift’s concurrency features, we can streamline the code, reduce complexity, and make our asynchronous logic more intuitive. In the following sections, we’ll explore how to implement this modern approach and discuss the challenges we faced and how we overcame them.

## Using withCheckedThrowingContinuation for Asynchronous Location Requests

Swift’s withCheckedThrowingContinuation is a powerful tool for bridging the gap between old callback-based APIs and Swift’s modern async/await model. Let’s break down how we can use it to simplify fetching the device’s current location.

### The Asynchronous currentLocation Property

Here’s how we expose the current location using `withCheckedThrowingContinuation`:

```
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    private var currentLocationContinuation: CheckedContinuation<CLLocation, Error>?

    override init() {
        super.init()
        locationManager.delegate = self
    }

    /// The current location of the device.
    ///
    /// If the proper permissions are not granted, this will throw an error.
    @MainActor
    public var currentLocation: CLLocation {
      get async throws {
        // Cancel any existing continuation before creating a new one to avoid leaks.
        if let existingContinuation = currentLocationContinuation {
          existingContinuation.resume(throwing: CancellationError())
          currentLocationContinuation = nil
        }
        
        return try await withCheckedThrowingContinuation { continuation in
          // Store the continuation to be resumed later
          currentLocationContinuation = continuation
          locationManager.requestLocation()
        }
      }
    }
}
```

### Explanation of What’s Happening

When we call await locationManager.currentLocation, the code execution is suspended, and control is handed over to the withCheckedThrowingContinuation block. Let’s break down how this process works:
1. Creating the Continuation:
    - The `withCheckedThrowingContinuation` function provides us with a continuation object that we can store and later use to resume execution.
    - In our example, we store this continuation in the currentLocationContinuation property.
2. Requesting the Location:
    - Once the continuation is stored, we call `locationManager.requestLocation()`. This triggers the `CoreLocation` framework to start fetching the current location.
3. Resuming the Continuation:
    - When the location manager successfully retrieves the device’s location, the delegate method `locationManager(_:didUpdateLocations:)` is called.
    - In this delegate method, we resume the suspended task by calling `currentLocationContinuation?.resume(returning: location)`, passing the fetched CLLocation to the awaiting code.

```
func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    if let location = locations.last {
        currentLocationContinuation?.resume(returning: location)
        currentLocationContinuation = nil // Clear the continuation after resuming
    }
}
```

4. Handling Errors:
- If an error occurs during location fetching, the delegate method `locationManager(_:didFailWithError:)` is triggered. Here, we call `resume(throwing:)` on the continuation to throw the error back to the awaiting code.

```
func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    currentLocationContinuation?.resume(throwing: error)
    currentLocationContinuation = nil // Clear the continuation after resuming
}
```

### Why We Set the Continuation to nil

After calling .resume(returning:) or .resume(throwing:), we immediately set currentLocationContinuation to nil. This is crucial for a couple of reasons:
- **Single Use of Continuation**:
  - A CheckedContinuation can only be resumed once. If you try to call `.resume()` on the same continuation more than once, your app will crash.
  - By setting currentLocationContinuation to nil after resuming, we ensure that we don’t accidentally reuse the continuation.
- **Preventing Memory Leaks**:
  - Clearing the continuation after use also helps prevent potential memory leaks, especially in cases where the LocationManager might continue to exist after the location request completes.

### Why We Use @MainActor

We annotate the currentLocation property with `@MainActor` because:
- **UI Updates**: Fetching the location often involves permission prompts that must be presented on the main thread.

- **Ensuring Thread Safety**: By marking the property as `@MainActor`, we ensure that any code accessing this property is run on the main thread, preventing potential threading issues when interacting with `CoreLocation`.
### Benefits of Using withCheckedThrowingContinuation

- **Cleaner Code**: This approach replaces the old delegate pattern with a modern, more readable async/await pattern.
- **Error Handling**: By using withCheckedThrowingContinuation, we can handle errors using Swift’s try/catch mechanism, making error handling more consistent with the rest of the Swift language.
- **No Callbacks**: We eliminate the need for callbacks, making the code easier to follow and reducing the risk of callback-related bugs.

### Using It in SwiftUI

Here’s an example of how you can use the currentLocation property in a SwiftUI view:

```
import SwiftUI

struct ContentView: View {
    @StateObject private var locationManager = LocationManager()
    @State private var currentLocation: CLLocation?

    var body: some View {
        VStack {
            if let location = currentLocation {
                Text("Location: \(location.coordinate.latitude), \(location.coordinate.longitude)")
            } else {
                Text("Fetching location...")
            }

            Button("Get Current Location") {
                Task {
                    do {
                        currentLocation = try await locationManager.currentLocation
                    } catch {
                        print("Failed to get location: \(error)")
                    }
                }
            }
        }
    }
}
```

In this example, calling locationManager.currentLocation suspends the task until the location is fetched or an error occurs, allowing us to handle the result or error seamlessly using Swift’s concurrency model.

## Using AsyncStream for Continuous Data Streams

While `withCheckedThrowingContinuation` works well for fetching a single value asynchronously (e.g., getting the current location once), it’s not ideal for continuous data streams like real-time location updates. For this scenario, `AsyncStream` is a better fit, as it allows for emitting multiple values over time in an asynchronous context.

### You Might Try This

Initially, you might attempt to use `AsyncStream` to handle continuous location updates from CLLocationManager, like so:

```
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate {
  private let locationManager = CLLocationManager()
  private var locationContinuation: AsyncStream<CLLocation>.Continuation?

  override init() {
      super.init()
      locationManager.delegate = self
  }

  func locationUpdates() -> AsyncStream<CLLocation> {
    AsyncStream { continuation in
      self.locationContinuation = continuation
      locationManager.startUpdatingLocation()

      continuation.onTermination = { _ in
        locationManager.stopUpdatingLocation()
        self.locationContinuation = nil
      }
    }
  }

  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    if let location = locations.last {
      locationContinuation?.yield(location)
    }
  }
}
```

### But You Will Encounter These Issues
- **Non-Sendable Type Error**: In Swift 6, you’ll encounter the following error inside the `continuation.onTermination` closure:

```no-highlight
Capture of 'locationManager' with non-sendable type 'CLLocationManager' in a @Sendable closure
```
This error occurs because AsyncStream requires `@Sendable` closures, which can be safely passed between concurrency domains since the `onTermination` callback is called in context of the thread doing the stream iteration not our context. In addition, `CLLocationManager` is not inherently `Sendable` because it’s not designed to be safely accessed from multiple threads without explicit synchronization.

**Behavior in Swift 5.10**: Interestingly, if you run the same code on Swift 5.10, you won’t encounter this error. In Swift 5.10, the compiler is less strict about enforcing Sendable conformance, which allows the code to compile and run smoothly. However, this lack of strictness can lead to potential concurrency issues that are only caught in Swift 6, where the compiler enforces the new concurrency rules more rigorously.

- **Thread Safety Concerns**: As mentioned previously, the `onTermination` closure can be called on different threads. Without proper synchronization, accessing locationContinuation directly can lead to race conditions.

- **Single Subscriber Limitation**: The above implementation supports only a single subscriber. If locationUpdates() is called multiple times, previous continuations will be overwritten, disconnecting previous subscribers.

### Here Is Why

- **Swift Concurrency Model**: Swift 6 enforces stricter concurrency rules, requiring types used in @Sendable closures to conform to the Sendable protocol. Since CLLocationManager is not Sendable by default, trying to access it inside AsyncStream’s @Sendable closure results in a compile-time error.
- **Non-Sendable Captures**: Capturing self or locationManager directly in @Sendable closures can lead to unsafe behavior in concurrent contexts.
- **Race Conditions**: Without synchronization, mutable shared state (like locationContinuation) accessed from different threads can lead to data races, resulting in crashes or inconsistent behavior.

### This Is How to Solve Them

To address these issues, we need to:
1. **Extend CLLocationManager to Conform to Sendable**: We’ll use `@unchecked @retroactive` Sendable to declare CLLocationManager as Sendable.
2. **Introduce a _Protected_ State with a Lock**: We’ll synchronize access to shared state using a custom lock to prevent race conditions.
3. **Support Multiple Subscribers**: Store continuations in a dictionary to allow multiple subscribers to receive updates simultaneously.

 Step 1: Making CLLocationManager Sendable

```
/// Extends `CLLocationManager` to conform to the `Sendable` protocol.
///
/// - Note:
///   - The `@unchecked` attribute indicates that we are manually asserting the `Sendable` conformance,
///     and the compiler will not enforce thread-safety checks for this type.
///   - The `@retroactive` attribute allows us to retroactively conform `CLLocationManager` to `Sendable`
///     within our module.
extension CLLocationManager: @unchecked @retroactive Sendable {}
```

By marking `CLLocationManager` as `@unchecked @retroactive Sendable`, we are asserting that we will handle its thread safety manually. This is necessary because `CoreLocation`’s delegate methods are called on different threads, and CLLocationManager itself is not inherently thread-safe.

### Step 2: Introducing a Protected State with a Lock

The protected state is an object holding a mutable state that should be protected by a locking mechanism.

```
struct ProtectedState {
    /// Continuation for delivering `CLAuthorizationStatus` status to most-recent caller of `locationUpdates()`
    fileprivate var locationStreamContinuations: [UUID: AsyncStream<CLLocation>.Continuation?] = [:]
    
    /// The location manager instance.
    fileprivate var locationManager = CLLocationManager()
}
```

We will use a custom lock to synchronize access to the shared state:

```
import Foundation
import os

@available(iOS 16.0, *)
final class ModernLock<State: Sendable>: Sendable {
  private let lock: OSAllocatedUnfairLock<State>

  init(initialState: State) {
    self.lock = OSAllocatedUnfairLock(initialState: initialState)
  }

  func withLock<R: Sendable>(_ body: @Sendable (inout State) throws -> R) rethrows -> R {
    try lock.withLock(body)
  }
}
```

if we need to support prior versions of iOS, we can use `NSLock`:

```
import Foundation

final class LegacyLock<State>: @unchecked Sendable {
  private var state: State
    
  private let lock = NSLock()
    
  init(initialState: State) {
    self.state = initialState
  }

  func withLock<R: Sendable>(_ body: @Sendable (inout State) throws -> R) rethrows -> R {
    lock.lock()
    defer { lock.unlock() }
    return try body(&state)
  }
}
```

### Step 3: Implementing the Thread-Safe LocationManager with Multiple Subscribers

Now, we’ll refactor the LocationManager to use a protected state and support multiple subscribers:

```
import CoreLocation
import os

class LocationManager: NSObject, CLLocationManagerDelegate {
  private let protectedState = ModernLock(initialState: ProtectedState())

  /// The underlying `CLLocationManager` instance used to manage location updates.
  ///
  /// Access to the `locationManager` is synchronized through a lock to ensure thread safety,
  /// preventing concurrent access and potential data races. By encapsulating the getter and setter
  /// within `protectedState.withLock`, we guarantee that any read or write operations on
  /// `locationManager` are performed atomically.
  ///
  /// - Note:
  ///   - Since `CLLocationManager` is not inherently thread-safe and we've extended it to conform
  ///     to `Sendable` using `@unchecked @retroactive Sendable`, we must manually ensure its
  ///     thread safety.
  ///   - All interactions with `locationManager` should go through this computed property to
  ///     maintain synchronization.
  private var locationManager: CLLocationManager {
      get {
          protectedState.withLock {
              $0.locationManager
          }
      }
    
      set {
          protectedState.withLock {
              $0.locationManager = newValue
          }
      }
  }

  override init() {
    super.init()
    locationManager.delegate = self
  }

  /// Returns an `AsyncStream` for location updates.
  public func locationUpdates() -> AsyncStream<CLLocation> {
    AsyncStream(bufferingPolicy: .bufferingNewest(1)) { continuation in    
      // Generate a unique identifier for this subscriber
      let id = UUID()
        
      locationManager.startUpdatingLocation()
        
      // configure tear-down logic
      continuation.onTermination = { [protectedState] _ in
        protectedState.withLock {
          $0.locationStreamContinuations[id] = nil
          if $0.locationStreamContinuations.isEmpty {
            $0.locationManager.stopUpdatingLocation()
          }
        }
      }
        
      // update internal state
      protectedState.withLock {
        $0.locationStreamContinuations[id] = continuation
      }
    }
  }

  // MARK: - CLLocationManagerDelegate Methods

  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    if let lastLocation = locations.last {
      let continuations = protectedState.withLock {
        Array($0.locationContinuations.values)
      }

      for continuation in continuations {
        continuation.yield(lastLocation)
      }
    }
  }

  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    // Handle errors if necessary
  }
}

extension LocationManager {
  /// Object holding a mutable state that should be protected by a locking mechanism.
  struct ProtectedState {
    /// Continuation for delivering `CLAuthorizationStatus` status to most-recent caller of `locationUpdates()`
    fileprivate var locationStreamContinuations: [UUID: AsyncStream<CLLocation>.Continuation?] = [:]
    
    /// The location manager instance.
    fileprivate var locationManager = CLLocationManager()
  }
}

extension CLLocationManager: @unchecked @retroactive Sendable {}
```

### Explanation of the Solution

- **Sendable Compliance**: By extending CLLocationManager with `@unchecked @retroactive Sendable`, we satisfy Swift’s concurrency requirements, allowing us to safely use it in @Sendable closures.
- **Thread Safety with ModernLock**: We use a custom lock to manage access to shared state. This ensures that all interactions with locationManager and continuations are thread-safe.
- **Supporting Multiple Subscribers**: By using a dictionary to store continuations, we can handle multiple subscribers concurrently. Each subscriber is identified by a UUID, and their continuations are cleaned up upon termination.

### Benefits of This Approach

- **Thread-Safe Integration**: By synchronizing access to locationManager and continuations, we prevent race conditions and undefined behavior.
- **Scalable**: Multiple subscribers can receive location updates independently, making the solution more flexible for complex use cases.
- **Modern Concurrency Support**: Leveraging Swift’s concurrency model with AsyncStream and Sendable ensures that our code is future-proof and aligns with Swift’s best practices.

## Conclusion

By bridging `CoreLocation`’s delegate pattern to Swift’s concurrency model, we can modernize our code to be more readable and maintainable. However, integrating legacy APIs like `CLLocationManager` into Swift’s strict concurrency model requires careful handling:
- **Sendable Conformance**: We extended CLLocationManager to conform to Sendable, allowing it to be safely used in @Sendable closures.
- **Thread Safety**: Introducing a custom lock ensured that shared state is accessed safely, preventing data races.
- **Scalability**: By supporting multiple subscribers with AsyncStream, we made our solution flexible enough to handle concurrent updates in real-time.

## Native Support in iOS 17 for Location Updates

Starting with iOS 17, Apple introduced native support for streamlined location updates in SwiftUI, simplifying the integration of `CoreLocation` with the modern concurrency model. This means that a lot of the custom bridging we’ve implemented to adapt CLLocationManager for async/await and AsyncStream is no longer necessary for apps targeting iOS 17 and later.

### What’s New in iOS 17?

With iOS 17, Apple provides built-in support for handling live location updates natively within SwiftUI. This includes new APIs that allow developers to use Swift’s concurrency features directly with `CoreLocation`, reducing the need for manual bridging code and workarounds.

### Key Resources:
- Apple Documentation:
    - [Supporting live updates in SwiftUI](https://developer.apple.com/documentation/corelocation/supporting-live-updates-in-swiftui-and-mac-catalyst-apps)
    - [Configuring your app to use location services](https://developer.apple.com/documentation/CoreLocation/configuring-your-app-to-use-location-services)
- WWDC 2023 Videos:
    - [Discover streamlined location updates](https://www.youtube.com/watch?v=1WG91q2qKVI)
	  - [What’s new in location authorization](https://www.youtube.com/watch?v=kHAEd-YEAEw)
- Sample Code:
    - Adopting Live Updates in CoreLocation: Example code on how to implement live location updates using the new APIs.

### What Does This Mean for Legacy Support?

While iOS 17 provides a more streamlined way to work with location updates, many apps still need to support older iOS versions. If your app supports iOS 16 or earlier, you’ll still need to rely on the custom solutions discussed earlier in this article, including:
- Extending CLLocationManager to conform to Sendable.
- Using withCheckedThrowingContinuation and AsyncStream to bridge the delegate pattern to Swift’s concurrency model.
- Ensuring thread safety with custom locks (ModernLock and LegacyLock).

However, if you are targeting iOS 17 and later exclusively, you can take advantage of Apple’s new APIs to simplify your location update code and reduce the complexity of handling concurrency manually.

By leveraging the new capabilities in iOS 17, you can significantly simplify your code for live location updates in SwiftUI. But for apps that need to support earlier iOS versions, the solutions we covered in this article remain essential for ensuring smooth and safe integration of `CoreLocation` with Swift’s concurrency model.
These new tools and APIs mark a significant step forward in streamlining location services on Apple platforms, making it easier than ever to build reactive, modern apps using `CoreLocation`. Be sure to explore the resources provided above to take full advantage of these new features!

## Last Words
I wrote this article to raise awareness and provide a comprehensive solution for an issue that many engineers will inevitably encounter when migrating to Swift 6. Swift’s stricter concurrency model introduces new challenges, especially when integrating older delegate-based APIs like `CoreLocation` with modern concurrency features like async/await and AsyncStream. By sharing my solution, I hope to save others the countless hours I spent troubleshooting and experimenting.
I'd like to extend my gratitude to the [Swift community](https://forums.swift.org/t/bridging-the-delegate-pattern-to-asyncstream-with-swift6-and-sendability-issues/75754/6), whose discussions and insights were invaluable in solving these issues. A special thanks to the contributors on the Swift forums for their guidance and support.
I hope this article helps others navigate the complexities of Swift 6’s concurrency model, enabling them to modernize their codebases efficiently and confidently. Happy coding!