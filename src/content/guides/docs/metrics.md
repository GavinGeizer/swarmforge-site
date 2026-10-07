---
title: "Metrics, token usage and cost estimates"
description: "Track SwarmForge workers, measured token usage, preservation and retained VM estimates through the CLI and Prometheus metrics."
section: "docs"
order: 70
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/src/metrics.ts", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/OPERATOR-WORKFLOWS.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ENVIRONMENT.md"]
related: [{"title": "Benchmark methodology", "path": "/benchmarks/"}, {"title": "Worker capacity", "path": "/docs/workers/"}, {"title": "Artifact preservation", "path": "/docs/artifacts/"}]
---

SwarmForge metrics describe worker lifecycle, observed OpenCode token usage and artifact preservation. Cost reporting estimates configured token and retained-VM costs; it is not a provider invoice or an enforced spending limit.

## Inspect usage locally

```bash
swarmforge usage --json
swarmforge usage --worker <worker-id>
```

The dashboard also shows measured tokens, retained VM counts and cleanup candidates. Cleanup eligibility does not mean a VM has exceeded a retention deadline. Configure retention deliberately rather than treating a displayed candidate count as an automatic deletion schedule.

## Configure estimates explicitly

Token rates are supplied per million input, output, reasoning, cache-read and cache-write tokens. Rates apply to the configured exact model name. Missing categories and other model names remain unpriced; the report exposes measured tokens, priced tokens and whether coverage is complete.

A configured zero can represent a free rate. Choose rates according to your provider's accounting rules so reasoning or cached tokens are not mispriced. Retained VM hours include paused time and use available persisted lifecycle timestamps.

`SWARMFORGE_BUDGET_USD` emits an alert when the configured estimate crosses a threshold. It does not stop work or cap provider billing. Changing historical rates can change estimates without changing actual charges.

## Prometheus endpoint

The default metrics listener is `http://127.0.0.1:9090/metrics`, separate from the MCP port. It exports worker counts, queue depth, observed token categories, provisioning/task duration histograms and artifact/finalization metrics. The inference-request gauge estimates incomplete OpenCode assistant messages; it is not an exact model-server concurrency measurement.

Team labels use an allowlist, with other team IDs aggregated under `other`. Prometheus storage, dashboards and retention are external responsibilities. Protect the metrics listener with external network controls if exposed remotely.

## Measurements and benchmarks

Operational reports are useful inputs for a benchmark, but completion claims and reported tests still need independent checks. An orchestration study should distinguish queue time, VM provisioning, coding time, interventions, source correctness and preservation outcomes. SwarmForge currently publishes a methodology, not benchmark results.
