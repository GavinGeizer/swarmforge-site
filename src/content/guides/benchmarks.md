---
title: "Agent orchestration benchmark methodology"
description: "SwarmForge has not published orchestration benchmark results. This methodology defines the evidence future completion, time, token and cost reports must include."
section: "benchmarks"
order: 110
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/src/metrics.ts", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/OPERATOR-WORKFLOWS.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/WORKER-PROTOCOL.md"]
related: [{"title": "Operational metrics", "path": "/docs/metrics/"}, {"title": "System architecture", "path": "/architecture/"}, {"title": "Parallel development workflow", "path": "/use-cases/parallel-development/"}]
---

A SwarmForge orchestration benchmark is a reproducible evaluation of coding tasks executed by coordinated workers under a recorded environment, model and task configuration. SwarmForge has not published orchestration benchmark results; this page defines a proposed reporting methodology, not measured outcomes.

## Define the question and task set

Each study should identify its question, task selection procedure, repositories and base commits, permitted operations, expected deliverables and independent correctness checks. State whether the study measures independent tasks, dependent tasks, repository review or integrated feature delivery.

Compare like-for-like conditions and report failed attempts, timeout cases, exclusions and human interventions. Task completion reported by a worker is not equivalent to a correct, reviewed source handoff.

## Record the execution environment

For each run, record the date, SwarmForge version and commit, OpenCode version, VM provider and snapshot, host/guest resources, repository commit, concurrency and queue limits, timeouts, model provider and exact model ID. Include relevant inference parameters and the manager's instructions or versioned prompt where available.

Do not expose tokens, private repository contents or provider credentials in a public run bundle. Publish enough non-secret information to reproduce the setup and understand limits.

## Publish an evidence table

| Field | Required evidence |
| --- | --- |
| Model and provider | Exact IDs, endpoint protocol and model/inference settings |
| Task | Versioned instructions, repository and base commit |
| Completion rate | Numerator, denominator and independent grading rule |
| Time | Queue, provisioning, coding, review and end-to-end wall time |
| Cost | Actual provider charges when available; separately label estimates and unpriced usage |
| Token usage | Input/output/reasoning/cache categories and measurement source |
| Interventions | Follow-ups, restarts, retries, corrections and operator actions |
| Methodology | Task selection, baselines, repetition count, exclusions and uncertainty |
| Environment and date | Snapshot, resources, versions, concurrency and run timestamps |
| Artifacts | Reports, test output, result records and source handoff commits |

## Separate capability from outcomes

A configured worker limit is not a benchmark of throughput. Metrics-derived cost estimates are not billing statements. Report correctness, source integration and artifact preservation separately, because a completed coding turn can still need review or recovery.

Future result pages should include their original evidence, limitations and methodology links. Do not publish placeholder scores, invented speedups or product comparison rankings before a study is complete.
