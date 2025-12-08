---
title: 'Implicit Dependencies, Broken Graphs, and Architectural Integrity in Modular iOS System'
date: '2025-12-09'
description: 'A deep dive into a subtle but damaging flaw in modular iOS codebases: implicit dependencies. Learn why they occur, why the build system enables them, and how Tuist helps solve this issue.'
is_hidden: false
---

# Implicit Dependencies, Broken Graphs, and Architectural Integrity in Modular iOS System

Modular architectures are now a common direction for iOS teams that want to improve build performance, enable parallel feature development, and keep codebases maintainable. By breaking projects into multiple modules or frameworks, developers gain control over boundaries and dependencies. However, modularization has a hidden flaw that can undermine those benefits if not carefully monitored: implicit dependencies.

These dependencies silently form when a target imports a module without declaring it. The code compiles, the feature ships, everyone feels productive, and yet the manifest no longer represents the truth. Over time, the dependency graph becomes inaccurate, and the architecture collapses under its own weight.

This article explains why implicit dependencies occur, why they are so hard to eliminate, how Tuist detects them, and how to automate detection with a robust prebuild script. We will also cover an SPM-oriented alternative for teams using Swift Package Manager and compare how other build systems such as Bazel approach dependency correctness.

## What are implicit dependencies?

An implicit dependency is created when a Swift file performs an import of another module, but that module is not listed as a dependency of the target. Because the build still succeeds, it appears harmless.

For example:

```swift
import FeaturePayments
```

If the target that imports `FeaturePayments` does not declare it under its dependencies, that target has formed an implicit connection. It now relies on something it never officially depends on.

Small leaks become big leaks. You may see:
* Hidden architectural couplings
* Targets accessing internals that were never intended to be shared
* Dependency cycles that appear only after a clean build
* CI failures that do not reproduce locally
* A manifest that lies about what depends on what
* Features such as SwiftUI previews becoming unreliable because they depend on precise and accurate dependency resolution

Implicit dependencies transform a modular codebase into a deceptive one.

## Why implicit dependencies happen

Implicit imports are rooted in how Xcode and the Swift toolchain were designed. They are not bugs; they are systemic behaviors of the ecosystem.

### Shared build artifacts

Xcode compiles targets into a shared build products directory inside `DerivedData`. Because that directory is globally visible to the build system, other modules can discover those compiled products even if no dependency is declared. This gives the illusion that module boundaries are respected even when they are not. This behavior is documented and analyzed in the article [Implicitness in Xcode and SPM. Why Apple?](https://pepicrft.me/xcode-implicit-dependencies/) by Pedro Piñera, a co-founder of Tuist. 

### Target inference and historical convenience

Xcode infers dependencies implicitly and tries to make builds succeed without strict declarations. Community discussions such as this StackOverflow thread explain [how Xcode identifies implicit target dependencies](https://stackoverflow.com/questions/37794402/how-does-xcode-find-implicit-target-dependencies).

### Transitive visibility

If `Target A` depends on `Target B`, and `Target B` depends on `Target C`, then `A` may end up importing `C` successfully even when `A` does not declare `C`. The dependency graph becomes impossible to trust.

These behaviors allow code to compile even when the dependency graph is incorrect. They also explain why implicit dependencies cannot simply be disabled.

## Why implicit dependencies cannot be fully prevented (yet)

Eliminating implicit dependencies would require changing fundamental assumptions in Xcode and the Swift toolchain. Several forces prevent this from happening immediately:
* Build products are intentionally shared rather than sandboxed.
* Backward compatibility prevents Apple from breaking existing projects.
* The compiler validates types, not dependency declarations.

Other build systems approached the problem differently. [Bazel separates **declared dependencies** from **actual dependencies**](https://bazel.build/concepts/dependencies) and enforces correctness at the graph level via sandboxing. If a target imports something it does not explicitly list, the build does not proceed. In contrast, Xcode implicitly tries to resolve imports and make builds succeed, which leaves correctness to convention unless external tooling is added.

However, there is movement on Apple's side. With the transition to [Explicit Module Builds in Xcode 16](https://developer.apple.com/videos/play/wwdc2024/10171/), the build system is shifting away from implicit discovery. By pre-scanning sources to build a deterministic graph, Apple is enabling features like [Project-wide caching](https://developer.apple.com/documentation/xcode/improving-build-efficiency-with-explicit-modules) and slowly reducing reliance on the volatile nature of `DerivedData`. 

As detailed in the [Swift.org Explicit Module Builds announcement](https://www.swift.org/blog/explicit-module-builds-new-swift-driver/), this moves the responsibility of dependency resolution from the compiler to the build system. A future state where importing a module without declaring it is impossible becomes conceivable, but until Explicit Modules become the default and strict enforcement is applied, we are not there yet.

For a larger context on why implicit dependencies are problematic in any build system, see [Implicit Dependencies in Build Systems](https://www.tweag.io/blog/2020-09-16-implicit-build-dependencies/) from Tweag.

Since we cannot yet rely on the build system to enforce this strictly, the only sustainable way to handle implicit dependencies is to detect them via tooling.

## How Tuist solves this: tuist inspect implicit-imports

Tuist provides static analysis to identify implicit dependencies in a modular project. Rather than trying to patch Xcode behavior, Tuist inspects your source code and dependency graph directly.

The Tuist team documents this functionality [here](https://docs.tuist.io/guides/develop/inspect/implicit-dependencies).

Running:

```bash 
tuist inspect implicit-imports
```

Tuist performs the following:
* Scans all modules for import statements
* Maps imports to declared dependencies
* Reports modules that are imported without being declared
* Fails with actionable output when issues exist

This check is based on static analysis. Imports hidden behind runtime conditions or compiler directives that are resolved at build time cannot be detected. For example:

```swift
#if canImport(InternalFeature)
import InternalFeature
#endif
```

Such patterns bypass static import detection and must be avoided if you expect your dependency graph to remain verifiable.

## SPM alternative: explicit-dependency-import-check

For teams using Swift Package Manager, there is a community plugin called [explicit-dependency-import-check](https://github.com/Nikoloutsos/explicitDependencyImportCheck) that performs similar validation. It inspects import statements and compares them against dependencies declared in `Package.swift`.

This plugin only works for SPM-based projects. It is a natural fit for pure Swift package setups and a complement to Tuist for hybrid ecosystems.

## Automating detection with a prebuild or CI script

Developers will not run dependency checks manually. Automation is mandatory. The script below ensures that implicit dependencies are caught during builds, CI, or both.

It handles:
* Fixing PATH issues introduced by Xcode
* Running from the repository root
* Verifying that Tuist is installed
* Failing the build if implicit dependencies are detected

```bash
# 1. Fix the PATH
# Xcode runs scripts with a stripped path. We must explicitly add:
# - Mise shims ($HOME/.local/share/mise/shims)
# - Homebrew (/opt/homebrew/bin)
# - Standard local bin ($HOME/.local/bin)
export PATH="$PATH:/opt/homebrew/bin:$HOME/.local/bin:$HOME/.local/share/mise/shims"

# 2. Ensure we are at the Repository Root
# Tuist needs to run where Project.swift or Tuist.swift is located.
if command -v git >/dev/null 2>&1; then
  cd "$(git rev-parse --show-toplevel)"
fi

# 3. Check if Tuist is actually installed/available
if ! command -v tuist >/dev/null 2>&1; then
  echo "⚠️  Tuist not found in PATH. Skipping implicit dependency check."
  exit 0
fi

# 4. Run the Inspection
OUTPUT=$(tuist inspect implicit-imports 2>&1)
EXIT_CODE=$?

# 5. Check results
if [ $EXIT_CODE -ne 0 ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ IMPLICIT DEPENDENCY VIOLATIONS FOUND"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "$OUTPUT"
  echo ""
  echo "To fix: Add these dependencies to your targets or"
  echo "remove the import statements from your source files."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
```

This ensures that no target can accidentally form a dependency that is not declared. Architecture becomes enforceable rather than aspirational.

## Best practices for teams

To maintain a healthy modular codebase:
* Declare every dependency explicitly even if the build passes without it.
* Use Tuist or SPM tooling to enforce correctness.
* Run checks in CI or precommit hooks to avoid regressions.
* Avoid leaking implementation details across modules.
* Treat dependency correctness as an architectural discipline.

Implicit dependencies are invisible until they cause failures, and by then they are expensive to unwind.

## Conclusion

Implicit dependencies are a systemic artifact of the legacy Xcode build system. While tools like Bazel enforce strict graphs by design, and Apple's new Explicit Modules are moving in that direction, Xcode defaults are still permissive.

The right response is not to trust developers to remember them, but to enforce them automatically. Tuist and SPM tooling provide the means. By integrating checks into builds and CI, teams ensure that modularization is backed by enforcement rather than convention.

A modular architecture without dependency enforcement is a diagram. An enforced architecture is a system.

Choose the latter.