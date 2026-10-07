---
title: "Artifacts and durable deliverables"
description: "SwarmForge preserves worker files in private coordinator storage, with bounded text previews and checksum-verified downloads."
section: "docs"
order: 60
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARTIFACTS.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARTIFACT-QUICKSTART.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/MCP-API.md"]
related: [{"title": "Repositories and source handoffs", "path": "/docs/repositories/"}, {"title": "Usage and preservation metrics", "path": "/docs/metrics/"}, {"title": "Setup and collection commands", "path": "/docs/#outputs"}]
---

A SwarmForge artifact is a worker-produced file or snapshot copied into private coordinator storage and recorded with its size, SHA-256 checksum and preservation state. Preserved artifacts remain available after the worker VM is destroyed.

## Completion and preservation are separate

A worker can finish its coding task while artifact collection is still pending or has failed. Preservation runs as a durable lifecycle stage after settlement and before normal destruction. Failed collection retains the VM for recovery; use `retry_worker_finalization` when the worker and its files are still available.

Preservation states include pending, collecting, preserved, failed and abandoned. Force destruction can abandon preservation and permanently lose files that have not reached coordinator storage.

## Read text without binary payloads

Use `read_worker_artifact` for bounded text from a live worker and `read_artifact` for bounded text from a preserved artifact ID. These interfaces return plaintext rather than requiring an agent to download base64 and reconstruct a document.

Text reads are size-bounded, screened for configured credentials and sanitized for terminal escapes. They are previews; they do not replace the full-file download when complete or binary content is needed.

## Download complete files

```bash
swarmforge artifacts list --worker <worker-id>
swarmforge artifacts preview <artifact-id>
swarmforge artifacts download <artifact-id> --output ./deliverable.md
```

The CLI streams authenticated downloads to disk, verifies size and checksum, and refuses existing destination files. This keeps large byte payloads out of the manager's model context. An artifact ID identifies a stored record; its source path is not an arbitrary host filesystem path.

## Storage and backups

Artifact storage defaults to an `artifacts` directory beside the SQLite database and can be configured with `SWARMFORGE_ARTIFACT_DIR`. Back up both the database and the artifact directory. Destroying the guest does not remove preserved coordinator copies, but losing the coordinator's storage can still lose deliverables.

The capture helper limits file sizes, entry counts and path depth and refuses unsupported or unsafe paths. Source branch handoff, database backups and artifact backups remain distinct responsibilities.
