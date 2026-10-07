---
title: "Repository review with parallel agents"
description: "Use SwarmForge to divide repository review into bounded scopes and collect preserved findings without granting automatic integration authority."
section: "use-cases"
order: 100
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/MCP-API.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/WORKER-PROTOCOL.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARTIFACTS.md"]
related: [{"title": "Manager review responsibilities", "path": "/docs/managers/"}, {"title": "Artifact collection", "path": "/docs/artifacts/"}, {"title": "Getting started with a review task", "path": "/docs/#first-task"}]
---

Repository review with SwarmForge means assigning bounded inspection tasks to isolated coding workers and collecting their findings as durable artifacts. Multiple review scopes can run concurrently against the configured repository.

## Divide the review by evidence

Choose specific scopes such as setup instructions, API input handling, artifact paths or restart behavior. Give workers concrete questions and ask for file locations, severity, reproduction conditions and uncertainty. A role named reviewer does not itself enforce read-only access; include explicit instructions and arrange suitable repository permissions.

Keep the reviewed commit fixed where possible and record it in the requested report. Separate findings from suggested patches. A manager should reconcile overlapping or contradictory observations before treating them as confirmed defects.

## Start with a small review

The setup guide includes a `spawn_worker` example using the built-in `review` template. That template requests `.swarmforge/artifacts/review.md`. Ask the worker to inspect a bounded subsystem and state whether source changes or test execution are permitted.

Review tasks still provision VMs and may incur inference costs. Begin with one scope, verify that the worker can reach the repository and produce a usable report, then add independent scopes.

## Collect and evaluate findings

Use `get_worker_result` for the persisted result and the artifact tools for the report. Read bounded plaintext previews inside the manager's context and download complete files through the CLI when needed.

A worker's claim is not independent validation. Reproduce important issues and check source references before changing code. Record false positives, incomplete coverage and any human intervention in your review notes.

## Preserve the audit trail

Preserved reports survive VM destruction, provided coordinator storage and SQLite remain available. Back them up together. After collection, use normal cleanup and inspect any source-safety or preservation refusal before deleting the worker environment.

No completion rate, defect-detection rate or speedup is claimed here. A measured review study needs a defined repository revision, task set and independent grading method.
