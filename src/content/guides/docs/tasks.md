---
title: "Tasks, teams and follow-up messages"
description: "Learn how SwarmForge groups workers by task and team, deduplicates creation requests, and queues follow-up turns."
section: "docs"
order: 20
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/MCP-API.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/WORKER-PROTOCOL.md"]
related: [{"title": "Worker lifecycle", "path": "/docs/workers/"}, {"title": "Manager responsibilities", "path": "/docs/managers/"}, {"title": "Parallel development workflow", "path": "/use-cases/parallel-development/"}]
---

A SwarmForge task is a persistent ownership label that groups coding workers and their results under a task ID and team ID. A task can contain multiple workers; it is not a single process or an automatic dependency graph.

## Assign concrete work

Use `spawn_worker` with a `task_id`, a prompt and, optionally, a `team_id`, role, timeout and template. The default team is `default`. Built-in templates cover code, review, research and documentation, with explicit deliverable expectations.

Specify the files or subsystem to inspect, permitted changes, constraints and expected outputs. A role label alone does not enforce permissions or guarantee a review policy. `get_task` summarizes worker states and token usage for the requested task; `list_tasks` returns persisted task metadata.

## Retry creation safely

A caller-supplied `request_id`, scoped to the team, allows the manager to retry the same creation request without unintentionally launching another worker. Keep the request ID stable for a retry of the same request. Use a new request ID when assigning distinct work.

The returned worker ID identifies the environment that will execute the task. Provisioning is asynchronous: inspect the worker or wait for a lifecycle event rather than assuming the task is running as soon as the creation call returns.

## Continue a worker's session

`send_message` queues a follow-up on the existing worker. SwarmForge serializes turns for that worker; a queued message is not a second simultaneous agent inside its VM. Each turn has a timeout budget and durable dispatch metadata. Inspect the result before choosing a follow-up or replacement.

## Teams and access

Team IDs organize ownership, filtering and metrics. Teams share the deployment's trusted bearer access and are not security tenants. Use independent deployments and external access controls when separate trust boundaries are required.

SwarmForge supplies task grouping and worker control. The MCP manager remains responsible for decomposition, dependency order, conflict review and integration.
