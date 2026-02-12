---
title: 'Introducing Apple Notes MCP'
date: '2026-02-13'
description: 'Turn Apple Notes into an intelligent workspace with a powerful MCP integration designed for automation, organization, and advanced workflows on macOS.'
is_hidden: false
---

# Turning Apple Notes Into an Agent-Ready Knowledge Layer

I built 
<a href="https://github.com/TheInkedEngineer/apple-notes-mcp" target="_blank" rel="noopener noreferrer">
  Apple Notes MCP
</a>
to solve a practical problem and to learn MCP by building something production-grade end to end.

I have more than 250 notes spread across Apple Notes accounts. Manual browsing works for occasional recall, but it breaks down when you need fast retrieval, structured filtering, and repeatable automation. Most note tools are designed for humans scrolling through UI, not for agents reasoning over your data.

---

## Why I Built This

Two motivations drove the build:

- **Practical:** I wanted faster retrieval and manipulation of my own notes without manually digging through folders.
- **Technical:** I wanted to understand how MCP actually works in real-world constraints, not just in toy demos.

Apple Notes was a great testbed because it combines:

- structured metadata (accounts, folders, timestamps),
- unstructured content (rich note bodies),
- platform constraints (AppleScript, TCC automation permissions, long-lived CLI behavior).

---

## What Existed, What Was Missing

There are existing Apple Notes MCP implementations and scripts. They were useful references, but most were missing one or more of these:

- comprehensive tool coverage for real workflows,
- deterministic validation and error contracts,
- strong test coverage,
- robust handling of Apple Notes edge cases (multi-account, nested folders, rich content formats).

I wanted something I could trust for daily use and extend safely over time.

---

## What Apple Notes MCP Actually Does

Apple Notes MCP runs as a stdio JSON-RPC MCP server and currently exposes **14 tools** across discovery, retrieval, writing, movement, and deletion.

Core capabilities:

- **Discovery:** `list_accounts`, `list_folders`
- **Read:** `list_notes`, `get_note`, `batch_get_notes`
- **Write:** `create_note`, `update_note`
- **Move:** `move_note`, `move_folder`
- **Delete:** `delete_note`, `batch_delete_notes`, `delete_folder`
- **Folder lifecycle:** `create_folder`, `rename_folder`

`list_notes` also supports date filtering with inclusive ranges:

- `createdAfter`, `createdBefore`
- `modifiedAfter`, `modifiedBefore`

Body output supports:

- `plain`
- `markdown`
- `html`

And it works across all notes accounts visible in Apple Notes, including iCloud, On My Mac, and Google-backed accounts.

---

## Design Principles

I optimized this project around correctness and predictable behavior:

- **Determinism over magic**
- **Strict validation and explicit error surfaces**
- **Composable tool orchestration over duplicate fragile scripts**
- **Swift 6 strict concurrency**
- **Main-actor isolation for AppleScript execution**

For risky operations, I intentionally use structured partial-success models instead of forcing fake all-or-nothing semantics.

---

## Tooling Strategy

The toolset is grouped by intent:

- discovery of account/folder topology,
- metadata-first read paths with optional body expansion,
- format-aware write/update paths,
- explicit move semantics,
- destructive operations with safety gates.

This keeps the external API intuitive while making internals maintainable and testable.

---

## Real Workflows This Enables

Examples from actual usage:

- “Find notes created last June–September that mention a topic.”
- “Fetch candidate notes with body content for deeper semantic filtering.”
- “Move notes/folders across account boundaries with explicit result contracts.”
- “Run batch retrieval/deletion and inspect missing/failed results safely.”

These are practical workflows, not demo-only commands.

---

## Hard Problems and Constraints

Some constraints strongly shaped architecture choices:

- AppleScript object references can behave unexpectedly after mutations.
- Automation/TCC permission behavior depends on the host process launching the MCP.
- Apple Notes HTML is a specialized dialect; rich-text conversion needs deliberate handling.
- Some operations are safer as orchestrated workflows than monolithic AppleScript blocks.

The implementation prioritizes correctness and debuggability under these constraints.

---

## Quality and Reliability

This release emphasizes engineering quality, not just feature count:

- broad unit/integration test coverage,
- explicit validation contracts,
- structured error mapping,
- destructive-operation safety gates,
- consistent serialization for MCP clients.

Current state: **302 passing tests across 24 suites**.

---

## What I Learned Building an MCP

The biggest lesson: MCP work is not primarily about wiring JSON-RPC handlers.

The hard parts are domain semantics:

- defining stable tool contracts,
- handling partial failures and retries,
- mapping platform quirks into consistent abstractions,
- preserving correctness as capability grows.

That is the difference between a prototype and a product.

---

## Explore the Project

- <a href="https://github.com/TheInkedEngineer/apple-notes-mcp" target="_blank" rel="noopener noreferrer">
  Github Repository
</a>

- Tool docs and examples are in the repo (`README`, `docs/TOOLS.md`, `docs/EXAMPLES.md`).
