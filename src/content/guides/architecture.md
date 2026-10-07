---
title: "SwarmForge architecture"
description: "The SwarmForge control plane connects trusted MCP managers, a durable SQLite coordinator, Freestyle VMs, OpenCode and private artifact storage."
section: "architecture"
order: 80
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARCHITECTURE.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/OPERATOR-WORKFLOWS.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARTIFACTS.md"]
related: [{"title": "Workers and lifecycle", "path": "/docs/workers/"}, {"title": "Managers and MCP", "path": "/docs/managers/"}, {"title": "Durable artifacts", "path": "/docs/artifacts/"}]
---

SwarmForge is a self-hosted orchestration control plane that coordinates autonomous OpenCode coding workers in isolated Freestyle VMs. Trusted managers assign work through MCP; SQLite stores lifecycle, dispatches, results and usage, while private coordinator storage holds preserved artifacts.

## Request and execution flow

```text
MCP manager → /mcp → coordinator → Freestyle VM → OpenCode → model endpoint
                         │              └→ configured Git tree
                         ├→ SQLite
                         └→ private artifact storage
Prometheus ← /metrics ← worker, usage and preservation records
```

A manager queues a worker with a task and instructions. The coordinator claims capacity, provisions the VM, initializes OpenCode and dispatches the turn. Multiple workers operate concurrently; turns within one worker are serialized and reuse its session.

The model service, Git hosting, guest development tools and VM snapshot are supplied externally. SwarmForge orchestrates these components and records outcomes rather than hosting models or replacing the coding agent.

## Durable state and restarts

Creation requests, dispatch claims, lifecycle transitions, results and token records are persisted in SQLite. Caller request IDs can deduplicate worker creation. Completion and selection of the next queued turn are atomic, preventing duplicate completion from duplicating recorded tokens or events.

On startup, the coordinator reconciles owned provider VMs and saved sessions. It can recover a VM whose creation response was lost, identify missing VMs and continue initialization. Ambiguous message delivery requires inspection instead of blindly repeating a potentially mutating task.

The durable event log supports cursor-based lifecycle waits and SSE replay. A restart does not guarantee every interrupted task can resume; failed or uncertain states are exposed for recovery.

## Source and artifact durability

Source changes belong to the configured Git tree. Optional branch handoff pushes and verifies a worker branch; it does not merge it or create a pull request. Declared files and bounded snapshots are copied to coordinator storage with length and SHA-256 checks.

Normal VM destruction requires safe settlement and preservation checks and refuses unverifiable source work. Automatic retention cleanup is disabled by default; explicitly enabling it still uses normal destruction protections. Force destruction bypasses protections and can abandon unpreserved data.

## Deployment and trust boundary

One Linux process owns a database; a shared-database multi-host coordinator is not supported. Back up both SQLite and artifact storage. Persistent storage, TLS, model capacity and Prometheus storage are external deployment responsibilities.

Trusted MCP leads share bearer access. Teams label ownership, not isolated security tenants. The public website contains documentation and installation assets, not a deployed manager endpoint or an admin console.

Current workers use OpenCode and Freestyle. No local-VM backend or native Codex/Claude Code worker runtime is established by this implementation.
