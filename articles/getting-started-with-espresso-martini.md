---
title: 'Getting started with `Espresso Martini` - The vapor powered mock server.'
date: '2023-01-08'
description: 'Espresso Martini is a Vapor-powered mock server written in Swift for your iOS and macOS applications.'
---

# Getting started with Espresso Martini

![article banner](/images/articles/espresso-martini/banner.png "banner")

[`Espresso Martini`](https://github.com/TheInkedEngineer/Espresso-Martini) is the latest project I have been working on. It's a mock server written fully in `Swift` and powered by [Vapor](https://vapor.codes/).

There are many ways to go about mocking data, and each comes with a series of pros and cons. Overriding the [`URLProtocol`](../insights/mocking-requests-using-url-protocol/) is a great way to do it, but is limited to Apple's platforms. Another option is running a local server on your machine using a ready-to-use web server, but that requires you to (probably) deal with JavaScript 🫣 and would only work on your simulator, and not your device offline.

Enters `Espresso Martini`. It has the best of both worlds; You can integrate it in your iOS or macOS application using Swift Package Manager, or run the executable and use it with your web application or Android application. It is extremely simple to use, and being written in Swift it offers type-safety and a super easy learning curve so anyone on the team can participate.

## Creating a `NetworkExchange`

A `NetworkExchange` is made of a request and a response. The request object represents the request we want our server to intercept, whereas the response is what we would like for the server to return.

Below is a simple example on how to create a NetworkExchange

```swift
MockServer.NetworkExchange(
  request: MockServer.Request(method: .GET, path: ["data"]), // 1
  response: MockServer.Response(
    status: .ok,
    headers: ["Content-Type": "application/json"],
    kind: .data(try! JSONEncoder().encode(Person(name: "Data")))
  ) // 2
)
```

1. This tells the server that it will need to intercept any request with a `GET` method, and a path to `/data`. The request supports all `HTTP` methods.
2. This tells the server to return to return a response with a status code `200`, `["Content-Type": "application/json"]` as a header and some `JSON` data. The response supports all `HTTP` status codes as well as the following response kinds:
- empty (no response body)
- json
- data (any data, including images)
- string
- fileContent (data written on a file)

## Configuring the server

It is really easy to configure the server. All you have to do is create an object that implements the `ServerConfigurationProvider` protocol. The package also provides a ready to use implementation `SimpleConfigurationProvider` that requires only the array of network exchanges. By default it will run the server on `127.0.0.1:8080`.

To configure the server just call `configure(using:)` and pass in your configuration as follow: `try server.configure(using: ServerConfiguration(networkExchanges: Demo.networkExchanges))`

To configure the server locally, open the downloaded project and change the `networkExchanges` in the configuration in `main.swift`.

## Running the server

To run the server from your iOS/macOS application use `try server.run()`.

If you want to run the server locally on your MacBook, either open the Xcode project and click the `play` button, or from inside the project's root folder insert the following command on your terminal `vapor run`.
