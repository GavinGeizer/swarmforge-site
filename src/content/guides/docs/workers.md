---
title: "Workers and isolated environments"
description: "Understand how SwarmForge runs OpenCode workers in isolated Freestyle VMs, queues capacity, reuses sessions, and preserves outputs."
section: "docs"
order: 10
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARCHITECTURE.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ENVIRONMENT.md"]
related: [{"title": "Task ownership and follow-ups", "path": "/docs/tasks/"}, {"title": "VM and model providers", "path": "/docs/providers/"}, {"title": "Artifact preservation", "path": "/docs/artifacts/"}]
---

A SwarmForge worker is an isolated virtual machine running an autonomous OpenCode coding agent assigned to a task. The coordinator stores its identity, task ownership, session, lifecycle and results in SQLite.

## How a worker starts

An MCP client calls `spawn_worker` with a task ID and instructions. SwarmForge records the request and returns a worker ID before provisioning finishes. The coordinator creates a Freestyle VM from the configured snapshot, prepares its workspace and starts OpenCode against the deployment's model endpoint.

The snapshot must already contain OpenCode, Python 3, Git, Bash, systemd and the tools needed for the task. SwarmForge does not install an arbitrary development environment into a blank VM. Provisioning and initialization have separate deadlines from the coding turn.

## Parallel work and capacity

Multiple workers can run concurrently in separate VMs. `SWARMFORGE_MAX_WORKERS` defaults to 50 retained VMs plus provisioning reservations; it is a capacity setting, not a measured throughput guarantee. `SWARMFORGE_MAX_PROVISIONING` defaults to four concurrent provisioning or booting workers. Additional requests remain in the durable queue while capacity is unavailable.

A completed, paused or failed worker can retain its VM and consume capacity. Ending a coding turn does not automatically release that environment. An operator must destroy eligible VMs or explicitly enable a retention policy.

## Lifecycle and follow-up

The normal lifecycle is `queued → provisioning → booting → ready → running ↔ waiting → completed/failed`. A worker can also be paused, cancelled, destroyed or marked `recovery_required` when delivery or cleanup cannot be confirmed safely.

Follow-up messages reuse the worker's stored OpenCode session and wait until its current turn finishes. This supports iterative work without asking a second coding turn to run simultaneously inside the same worker.

## Results and responsibility

The dashboard exposes current activity and persisted results. Reported tests and summaries come from the agent and need review. Preservation is tracked separately from task completion: a completed task can still have an artifact collection failure. Collect source handoffs and artifacts before deleting the environment.
