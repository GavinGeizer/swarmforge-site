---
title: "Repositories and Git handoffs"
description: "How SwarmForge prepares a configured Git workspace, hands off verified branches, and protects local-only source work during cleanup."
section: "docs"
order: 50
reviewed: "2026-10-07"
sources: ["https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ENVIRONMENT.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/ARCHITECTURE.md", "https://github.com/GavinGeizer/swarmforge-oss/blob/master/docs/CONFIGURATION.md"]
related: [{"title": "Artifacts and deliverables", "path": "/docs/artifacts/"}, {"title": "Parallel development", "path": "/use-cases/parallel-development/"}, {"title": "Manager review", "path": "/docs/managers/"}]
---

A SwarmForge repository is the externally managed Git source tree configured for a deployment's workers. Source code durability belongs to Git; SwarmForge's artifact store preserves declared files and snapshots separately.

## Prepare the source tree

Set `SWARMFORGE_GIT_TREE` to a cloneable repository URL or a workspace available to the worker. Prepared workspaces can use `none` or `none:/prepared/path` instead of cloning. Repository credentials, mounts and network access must be arranged explicitly.

The Git tree is currently configured per deployment, not selected independently on each `spawn_worker` call. Use separate deployment configurations when jobs need different repositories; do not assume a worker can receive an arbitrary repository URL through a role or task label.

## Branch handoff

Configured Git handoff creates a `swarmforge/<team>/<task>/<worker-id>` branch from the cloned default branch. Workers commit source changes. SwarmForge supplies credentials for the configured Git operations, pushes `HEAD`, verifies the remote commit and records branch/commit metadata in the result.

Supported configuration includes GitHub App handoff and SSH handoff. A GitHub App needs repository Contents write permission and installation access to the target repository. SSH handoff requires a reachable remote, dedicated key and pinned known-hosts configuration.

A verified push is a handoff, not an automatic pull request or merge. The manager or operator must review the branch, validate changes and integrate it into the intended base branch.

## Cleanup safety

Normal destruction checks the configured workspace and reported working directory for dirty files, untracked files and local commits absent from remote refs. Unverifiable or local-only work blocks cleanup. Remote refs are a conservative safety check, not proof that every external workspace is protected.

Force destruction deliberately bypasses protections and can lose work. Preserve deliverables and verify the source handoff first. Files outside declared workspaces and unusual mounts need separate operator review.
