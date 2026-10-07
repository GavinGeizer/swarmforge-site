# SwarmForge website and installer

Independent Astro website for https://getswarmforge.tech. Application source and binary releases live in [swarmforge-oss](https://github.com/GavinGeizer/swarmforge-oss).

## Files

- `src/pages/index.astro`: responsive landing page; the terminal task view is clearly illustrative.
- `src/pages/docs/index.astro`: installation, configuration, MCP connection, first task and operator workflows.
- `public/install`: canonical public Bash installer. No copy is maintained in the application repo.
- `src/layouts/` and `src/components/`: shared page shell, navigation, footer, installer command and dashboard example.
- `src/styles/site.css`: shared stylesheet, emitted as an external build asset to respect the site CSP.
- `public/assets/`: clipboard enhancement and favicon. No external fonts or browser analytics.
- `wrangler.jsonc`: static-assets deployment configuration for Workers Builds.
- `astro.config.mjs`: Astro 7.3.6 static output, canonical domain and trailing slashes. No server-side adapter or Cloudflare Functions is needed for this site.
- `package-lock.json`: pinned dependency tree; Node 24 selected for CI/Cloudflare builds.
- `public/_headers` and `_redirects`: content/security headers and the old sitemap redirect for Cloudflare static assets.
- `src/content/guides/`: canonical Markdown concepts, architecture, practical workflows and benchmark methodology.
- `src/lib/site.ts` and `src/layouts/SiteLayout.astro`: shared entity identity, metadata and truthful JSON-LD.
- `src/lib/faq.ts`: FAQ answers shared by visible HTML and structured data.
- `src/pages/llms*.txt.ts`: machine-readable navigation/reference generated from published content.
- `docs/SEO-GEO.md`: initial audit, implementation inventory and validation.
- `docs/SEARCH-SETUP.md`: owner steps for Search Console, Bing, crawler access and optional IndexNow.
- `docs/CONTENT-GUIDE.md`: publishing future concepts, use cases, comparisons and original research.
- `PLAN.md`: scope, implementation checklist and publication status.

## Local development and production build

Use Node 24 and npm 9.6.5 or newer. The project declares Node 24 as its minimum and uses it in CI/Cloudflare:

```bash
npm ci
npm run dev
```

Open the local URL printed by Astro (normally http://127.0.0.1:4321). For a production build:

```bash
npm run check:syntax
npm run check
npm run build
npm test
npm run preview
```

Run check and build sequentially because they share Astro's generated content cache. There is no separate lint framework; syntax checks, Astro type/template checks and rendered-output tests run in CI.

Astro generates `dist/`; do not edit or commit the generated directory. Pages builds from source on each production deployment. `public/install` and `public/_headers` are copied byte-for-byte into `dist/`. Local Astro preview does not apply Cloudflare `_headers`; Pages applies them after deployment.

## Cloudflare Workers Builds (deploy/preview command screen)

If Cloudflare asks for a Deploy command and Preview command, use the Workers Builds configuration included in this repo:

| Setting | Value |
| --- | --- |
| Worker name | `swarmforge-site` (must match `name` in `wrangler.jsonc`) |
| Repository | `GavinGeizer/swarmforge-site` |
| Production branch | `main` |
| Root directory | Repository root / `.` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Preview command | `npm run deploy:preview` |
| Node version | `24` |

`deploy` runs pinned Wrangler's `wrangler deploy`. `deploy:preview` runs `wrangler versions upload`, creating a version/preview URL without promoting it to production. This is Cloudflare's documented alternative to branch-isolated Previews and suits this static site, which has no runtime resource bindings. `npm run preview` remains the local Astro server; do not use it as the cloud preview deploy command.

`wrangler.jsonc` points static assets at `dist`, enables preview URLs, and serves the generated custom 404. The installer and `_headers` stay in those static assets. No Astro server adapter is needed. Cloudflare supplies build authentication through the repository connection; no token belongs in Git. Match the Worker name to the config, then attach the domain through that Worker's domain settings after its first production deployment.

Official command behavior: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ .

## Cloudflare Pages settings

The domain has already been added to Cloudflare and registrar nameservers changed by the owner. Once the DNS zone is Active:

1. Workers & Pages → Create application → Pages → Import an existing Git repository.
2. Connect GitHub and select **GavinGeizer/swarmforge-site**.
3. Configure:

| Setting | Value |
| --- | --- |
| Project name | `swarmforge-site` |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root (leave default) |
| Build environment | `NODE_VERSION=24`; optionally `ASTRO_TELEMETRY_DISABLED=1` |

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

Push site changes to `main`; Cloudflare Pages deploys independently from application releases. Update installation documentation if the application release contract or CLI changes. Keep the installer URL stable. GitHub CI installs dependencies with `npm ci`, checks Bash/JavaScript syntax, builds Astro and confirms the installer/header files are preserved; it does not execute the installer against real providers or users' configuration.

## Current publication status

The Astro site is published at https://github.com/GavinGeizer/swarmforge-site and its build/syntax CI passes. The first application binary release is prepared as a draft for owner review; it must be published before the installer can download it. Cloudflare Pages account connection, domain attachment and HTTPS provisioning remain to be completed using the settings above. See PLAN.md for the release link and deployment checklist.

## Framework support

Cloudflare documents Astro deployments with `npm run build` and `dist`: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ . This project prerenders its pages into static HTML; the installer is a public asset rather than an Astro route or server function. Astro's documented public directory behavior preserves these assets unchanged: https://docs.astro.build/en/basics/project-structure/#public .

## Search, retrieval and content maintenance

The site uses Astro's official sitemap integration: submit `/sitemap-index.xml`; `/sitemap.xml` redirects there. Error pages and non-HTML endpoints are omitted. Titles, descriptions, canonical URLs, Open Graph/social cards, breadcrumbs and JSON-LD come from the shared layout. Application source uses PolyForm Small Business License 1.0.0 (`PolyForm-Small-Business-1.0.0`); the entity metadata links the official terms. This is source-available rather than OSI-approved open source. The application's authoritative license file is at its repository root.

`/llms.txt` and `/llms-full.txt` are generated from the same published content, with current integration limits and benchmark status. They are supplementary navigation files, not an indexing guarantee. Follow [search setup](docs/SEARCH-SETUP.md) after deploying and [content maintenance](docs/CONTENT-GUIDE.md) when changing features or publishing evidence. IndexNow is optional, requires a build-time `INDEXNOW_KEY`, and never submits unless explicitly invoked with `--submit`.
