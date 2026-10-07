---
title: "VM providers and model endpoints"
description: "SwarmForge currently uses Freestyle VMs and OpenCode with an OpenAI-compatible tool-calling model endpoint. Learn the deployment requirements."
section: "docs"
order: 40
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ENVIRONMENT.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/CONFIGURATION.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARCHITECTURE.md"]
related: [{"title": "Worker environments", "path": "/docs/workers/"}, {"title": "Getting started", "path": "/docs/#prerequisites"}, {"title": "Local VM and cloud FAQ", "path": "/faq/#local-vms"}]
---

A SwarmForge provider supplies either the virtual machines that run coding workers or the model endpoint used by OpenCode. The current implementation uses Freestyle for worker VMs and an operator-configured OpenAI-compatible model service for inference.

## Infrastructure provider

Configure `FREESTYLE_API_TOKEN` and `FREESTYLE_SNAPSHOT_ID`. The snapshot must already provide the guest tools and a writable workspace. SwarmForge creates and manages VMs through Freestyle; it is not a general local-VM launcher.

The coordinator itself is self-hosted on Linux x64 with glibc. Self-hosting the coordinator does not remove the current Freestyle dependency for workers. A local hypervisor, Docker worker or alternative VM backend is not documented as a supported implementation.

## Model endpoint

Configure `SWARMFORGE_MODEL_BASE_URL`, `SWARMFORGE_MODEL_API_KEY` and the exact `SWARMFORGE_MODEL_NAME`. OpenCode calls an OpenAI-compatible chat-completions endpoint supporting tool calls. Protocol compatibility and sufficient model capability must be checked against the actual service.

A reachable URL does not prove that the endpoint accepts the required request format or tool calls. A locally hosted model may be usable if its endpoint satisfies the protocol and is reachable from the Freestyle VMs; a local-only loopback address on the coordinator will not be reachable from a remote worker.

These values are deployment settings. The current spawn interface does not offer arbitrary per-worker model or VM-provider selection.

## Readiness checks

`swarmforge doctor` validates local configuration without network requests. `swarmforge doctor --live` explicitly probes snapshot access and makes a small model tool-call request. Supplying `--vm` additionally checks tools inside an existing running VM; doctor does not create a VM.

The live check cannot establish every permission, repository credential or workload requirement. Begin with a small real task after validation and review the result.

## Costs and cleanup

VM and inference services may charge for usage. Cost estimates require configured rates, and missing rates are disclosed as unpriced usage. Budget alerts do not enforce a spending limit. Retained VMs remain an operator responsibility until normal cleanup or an explicitly enabled retention policy removes them.
