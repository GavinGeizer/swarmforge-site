---
title: "Managers and MCP coordination"
description: "Understand the MCP manager role in SwarmForge and how it delegates, observes, reviews and integrates parallel coding work."
section: "docs"
order: 30
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/MCP-API.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARCHITECTURE.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/README.md"]
related: [{"title": "Tasks and follow-ups", "path": "/docs/tasks/"}, {"title": "System architecture", "path": "/architecture/"}, {"title": "Compatibility questions", "path": "/faq/#coding-agents"}]
---

A SwarmForge manager is the trusted MCP client or agent that assigns tasks, observes workers and decides what to do with their results. SwarmForge provides orchestration tools; it does not supply the manager's reasoning model.

## Connect through MCP

Run `swarmforge serve` and connect a client that supports MCP Streamable HTTP to the configured `/mcp` URL. The default address is `http://127.0.0.1:8787/mcp`. When bearer authentication is configured, the client must supply the deployment's token.

The application README includes an OpenCode remote-MCP configuration example. Other clients need support for the same transport and authentication; a coding product's name alone does not establish compatibility. The current worker runtime remains OpenCode regardless of which supported MCP client manages it.

## Delegate and observe

Managers create workers with `spawn_worker`, inspect them with `get_worker`, read persisted results with `get_worker_result`, and continue sessions with `send_message`. `wait_for_state_change` observes the durable lifecycle log with a resumable cursor instead of repeatedly polling full worker records.

A manager can assign independent coding, review and documentation tasks concurrently. It should choose disjoint change scopes where possible and explicitly sequence tasks whose inputs depend on another worker's output.

## Review before integrating

Review the reported changes, test results, artifacts and Git handoff. Worker summaries are not independent verification. SwarmForge can preserve deliverables and verify a configured branch push, but it does not automatically open pull requests, merge branches or resolve conflicting changes.

A failed worker, preservation refusal or ambiguous dispatch may require operator inspection. Recovery guidance helps select the next action; blindly replaying a possibly delivered coding instruction can repeat mutations.

## Keep trust explicit

MCP leads share trusted access to the deployment. Team labels do not isolate users or repositories. Remote exposure requires configured accepted hosts, a bearer token and externally supplied TLS/network controls. The public website is separate from this private control-plane interface.
