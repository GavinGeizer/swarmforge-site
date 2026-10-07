# SwarmForge website and installer

Independent static website for https://getswarmforge.tech. Application source and binary releases live in [swarmforge-oss](https://github.com/GavinGeizer/swarmforge-oss).

## Files

- `public/index.html`: responsive landing page; the terminal task view is clearly illustrative.
- `public/docs/index.html`: installation, configuration, MCP connection, first task and operator workflows.
- `public/install`: canonical public Bash installer. No copy is maintained in the application repo.
- `public/assets/`: shared styles, clipboard enhancement and favicon. No external fonts, analytics or runtime dependencies.
- `public/_headers`: script content type/cache policy and site security headers for Cloudflare Pages.
- `PLAN.md`: scope, implementation checklist and publication status.

## Local preview

From this directory:

```bash
python3 -m http.server 8080 --directory public
```

Open http://localhost:8080. Local Python hosting does not apply Cloudflare `_headers`; those headers are applied after Pages deployment. Installer syntax: `bash -n public/install`. JavaScript syntax: `node --check public/assets/site.js`.

## Cloudflare Pages settings

The domain has already been added to Cloudflare and registrar nameservers changed by the owner. Once the DNS zone is Active:

1. Workers & Pages → Create application → Pages → Import an existing Git repository.
2. Connect GitHub and select **GavinGeizer/swarmforge-site**.
3. Configure:

| Setting | Value |
| --- | --- |
| Project name | `swarmforge-site` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `public` |
| Root directory | Repository root (leave default) |
| Environment variables | None |

4. Deploy and review the `*.pages.dev` preview.
5. Project → Custom domains → Set up a custom domain → `getswarmforge.tech`.
6. Complete Cloudflare's DNS prompts and wait for HTTPS provisioning.

The application repo is not deployed by Pages. This folder contains no deployment secrets.

## Release dependency

`/install` downloads a **published stable** `vMAJOR.MINOR.PATCH` release from `GavinGeizer/swarmforge-oss`. It resolves latest once, then pins all downloads to that version. Required assets:

- `swarmforge-vVERSION-linux-x64-glibc.tar.gz`
- `swarmforge-vVERSION-linux-x64-glibc.tar.gz.sha256`: external archive SHA-256, validated before extraction.

The archive contains exactly three regular files: `swarmforge`, `SHA256SUMS` (binary checksum), and `metadata-VERSION.json`. It is validated before extraction; executable checksum and reported version are checked before atomic installation.

At implementation start there are no GitHub releases. A draft release must be reviewed and published before the public installation succeeds. The installer reports this condition without replacing an executable. SHA-256 checks detect corruption, not independent publisher authenticity; signature verification is not currently implemented.

## Installer behavior

```bash
curl -fsSL https://getswarmforge.tech/install | bash
curl -fsSL https://getswarmforge.tech/install | bash -s -- --install-only
curl -fsSL https://getswarmforge.tech/install | bash -s -- --version 0.1.0 --install-only
curl -fsSL https://getswarmforge.tech/install | bash -s -- --no-modify-path
```

Currently Linux x64/glibc/GNU tar only. Requires standard curl/coreutils. Refuses root execution, unexpected archive paths/types, checksum/version mismatches and a symlinked destination executable. Temporary files are removed on completion/interruption; existing executable replacement is atomic. Set `SWARMFORGE_INSTALL_DIR` to an absolute path to override `~/.local/bin`.

Interactive onboarding reads `/dev/tty`. Noninteractive runs automatically install only. Existing local `.env` or global configuration are preserved; credentials are handled by the installed CLI's hidden prompts. PATH updates are idempotent and can be disabled. Profiles are never sourced by the installer. Live doctor and foreground serve require explicit choices; no VM is provisioned automatically and no MCP client file is silently changed.

## Updates

Push site changes to `main`; Cloudflare Pages deploys independently from application releases. Update installation documentation if the application release contract or CLI changes. Keep the installer URL stable. GitHub CI checks Bash/JavaScript syntax; it does not execute the installer against real providers or users' configuration.
