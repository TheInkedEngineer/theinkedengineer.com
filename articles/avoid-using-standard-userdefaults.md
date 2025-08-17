---
title: 'Avoid using UserDefaults.standard'
date: '2022-01-26'
description: 'UserDefaults is a fantastic, easy to use interface to save and retrieve data quickly. But do not use the standard instance.'
---

# Avoid using UserDefaults.standard

If you've written any iOS/macOS app, chances are you've dealt with _UserDefaults_. If not, _UserDefaults_ is an interface to the user's defaults database where key-value pairs are stored and persisted across app launches.

> _UserDefaults_ are not secure, and should NOT be used to persist any sensitive data like access tokens. The `Keychain` is a far better choice.

There's a lot to learn about _UserDefaults_ like when to use them, and how to sync them across devices and app groups. We are not going to delve into that, to know more about those arguments, [read the official Apple documents.](https://developer.apple.com/documentation/foundation/userdefaults)

Today, we are going over a not-so-ideal approach of using _UserDefaults.standard_. This shared default instance is automatically created by the system and contains some pre-set values from different domains. 

Since iOS apps are sandboxed, no app can access the _UserDefaults_ values of another app, unless they belong to the same [App group](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_application-groups).

Since apps cannot access each others _UserDefaults_, it should be fine to work with _UserDefaults.standard_, after all, no one can access these values and modify them, right? Well, not quite.

## Possible Conflicts

_UserDefaults.standard_ is shared throughout the app, including third party frameworks. In other words, if an application uses _FrameworkX_, any value saved inside of _UserDefaults.standard_ by the application or the framework can be accessed by either inside that sandbox. This may lead to conflicts if the application and included frameworks try to save a value for an identical key.

**Chances are slim, but good code don't leave stuff to chance**.

The most common approach to avoid such problem is to prefix any key, usually with the application/framework identifier. Saving a string would look something like this `UserDefaults.standard.set("Value", forKey: "com.domain.appName.key")`

The above example would make saving and retrieving values a lot safer, but we can take it one step further.

## Custom UserDefaults

A better approach would be to create a custom instance of _UserDefaults_ using `init(suiteName:)`. However, keep in mind that the suite name cannot be any of the following:
- The main bundle identifier
- The [global domain](https://developer.apple.com/documentation/foundation/userdefaults/1407355-globaldomain)
- nil, it will fallback to _UserDefaults.standard_

> This approach is even more important when creating a framework intended to be integrated in third party applications.

By wisely choosing the suite name and creating a separated _UserDefaults_ where to store the data, the conflict probability is practically nil. 

It doesn't stop there. There are even more benefits to instantiating _UserDefaults_ with `init(suiteName:)`.

### Organization

Obviously, from a pure statistical POV, it's safer to prefix the keys even in a custom_UserDefaults_. However, in a custom created user defaults, it's safe to omit the prefix from keys.

Some iOS Engineers worked with databases, others were luckier and never had to deal with them 😅. But anyone should know, you do not save ALL data in one single gigantic database.

Same way, you should not save all your user defaults in the same suites. Think of every _UserDefaults_ suite as its own database. Create a new one for every cluster of data, if your application of framework heavily relies on _UserDefaults_.

By clustering _UserDefaults_ it becomes easier to eventually migrate, manipulate and share only small datasets should it be needed when working on new iterations of an existing app. Clusters would dramatically reduce the probability of fucking up and corrupting data for users.

### Sharing is caring

The standard _UserDefaults_ cannot be shared. However, custom created _UserDefaults_ using `init(suiteName:)` enables sharing values between applications of the same app suite (by the same developer team) or with extensions of an application.

This is a multi step configuration that requires creating App groups which is out of the scope of this article. Find out more [here](https://developer.apple.com/library/archive/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html#//apple_ref/doc/uid/TP40014214-CH21-SW1) in the _Sharing Data with Your Containing App_ section.

Building from the start with custom created suites makes it future proof. No one likes to deal with data migration. A lot can go wrong with devices in the wild.

## Conclusion

In conclusion, 
- _UserDefaults.standard_ have no advantage. 
- A custom _UserDefaults_ leads to better organisation, is future proof and safer.