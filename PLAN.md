# SwarmForge website and installer delivery

## Scope

Independent repository at /home/overlord/swarmforge-site. Cloudflare builds Astro and deploys only dist/; both Pages and Workers Builds settings are documented. The application repository remains GavinGeizer/swarmforge-oss; GitHub Releases hold versioned binaries. No real SwarmForge/provider/model endpoint calls, no service restarts, and no secret material in the site.

## Design

- Astro 7.3.6 with static output; Node 24/npm build in Cloudflare, compiled HTML/CSS/browser JavaScript at runtime. Shared layouts and components keep navigation, metadata, footer and installation UI consistent.
- Responsive public homepage, accessible command copying, clearly labeled illustrative dashboard, focused setup docs and deployment instructions.
- Canonical Bash installer at public/install. Download a published stable release or requested vMAJOR.MINOR.PATCH; reject unsupported platforms and root execution.
- Verify an external archive SHA-256 before extraction, check archive entry names/types, then verify the executable checksum/version. Same-directory temporary install and atomic rename preserve existing executable on failures.
- Install into ~/.local/bin by default; configurable absolute directory. Idempotent shell PATH block with --no-modify-path opt-out. Never source downloaded shell profiles or .env data.
- Interactive onboarding uses /dev/tty; credentials remain handled by the installed init command. Existing .env/global config survive; noninteractive runs install only. Local doctor is automatic after setup. Live checks and foreground server start are offered explicitly.
- --help, --version VERSION, --install-only, --no-modify-path. No automatic VM provisioning, third-party messaging, client configuration changes, or release publication.

## Checklist

- [x] Installer and HTTP headers
- [x] Homepage and setup docs
- [x] Static syntax checks and website CI
- [x] Application release workflow emits verified external archive checksum
- [x] Independent local Git history
- [x] Create and push GitHub website repository
- [x] Build and verify release archive plus external checksum
- [x] Prepare first GitHub draft release for review
- [x] Document precise Cloudflare deployment settings and remaining user steps

## Progress

- Domain addition and registrar nameserver change completed by user.
- User requested a separate website directory/repository. Application working-tree skill/research changes are preserved.

- Static checks: Bash parser and browser JavaScript parser/compiler pass. Application TypeScript/Biome checks pass. No new tests or local test suite execution. Installer has not been run against a real release or provider.
- Independent native read-only review found two PATH issues: colon-containing install directories and custom Zsh/Fish configuration roots. Fixed by rejecting invalid PATH components and honoring absolute ZDOTDIR/XDG_CONFIG_HOME, with manual guidance for relative roots. Archive/checksum/release contract aligns; no further important issues identified by inspection.

## Publication status

The website repository is now published: https://github.com/GavinGeizer/swarmforge-site . Astro feature commit e9c397a passed its GitHub build/syntax workflow: https://github.com/GavinGeizer/swarmforge-site/actions/runs/37643769258 . Earlier GitHub write errors are resolved; application origin/master now includes release-checksum workflow and Astro deployment docs through 54cba5b.

The first binary release has been prepared as a draft: https://github.com/GavinGeizer/swarmforge-oss/releases (the v0.1.0 draft) . It contains version 0.1.0 built from application commit 0233a48, with the verified archive, external archive checksum, internal binary checksum, and build metadata. It has not been publicly published. Application CI for 54cba5b passed at https://github.com/GavinGeizer/swarmforge-oss/actions/runs/37643735699 .

### Remaining deployment actions

1. Review and explicitly publish the draft binary release. Public installation needs a stable published release; draft assets are not available to unauthenticated users.
2. Connect Cloudflare to GavinGeizer/swarmforge-site, production branch main, root directory ., Node 24. For the Workers Builds screen: build npm run build, deploy npm run deploy, preview npm run deploy:preview. For Pages: framework Astro, build npm run build, output dist.
3. Attach getswarmforge.tech through the selected Worker/Pages project domain settings and complete HTTPS provisioning.
4. Confirm the public script response and install flow before promoting the curl command. The installer was reviewed and syntax-checked, but was not executed end-to-end against a public release.

No provider/model endpoint was contacted and no running service was restarted. Earlier application working-tree skill/research edits remain preserved.

## Framework migration — requested by user

- [x] Verified Cloudflare framework support and its Astro build/output settings against official documentation.
- [x] Migrated homepage, documentation and 404 into Astro routes; added reusable layout, header/footer, dashboard example and installation command components.
- [x] Pinned Astro 7.3.6 and generated npm lockfile; selected Node 24 for builds.
- [x] Kept public/install and public/_headers unchanged; compiled output copies both byte-for-byte.
- [x] Production Astro build and Bash/JavaScript syntax checks pass; no test suite was added or run.
- [x] Updated Cloudflare settings and CI to Astro / npm run build / dist.
- GitHub publication is complete. Cloudflare account connection and public binary release publication remain owner actions described above.

- Framework review: no important issue in deployment settings, route output, CSP or copied installer. Reviewer found the documented Node minimum did not cover a locked dependency's newer minimum; the project now explicitly requires Node 24, matching CI/Cloudflare. The 404 header's workflow link now returns to the homepage section.

## Workers build commands — requested by user

- Added pinned Wrangler 4.148.0 and a static-assets wrangler.jsonc for Worker swarmforge-site.
- Production deploy script: wrangler deploy; preview deploy script: wrangler versions upload. Local Astro preview remains a separate npm script.
- Inspected current official Cloudflare build docs and the installed Wrangler command help. A local Wrangler deploy dry run successfully discovered the generated assets without upload or authentication. No actual Cloudflare deployment or preview upload was performed.
- Documented Worker name matching, build/deploy/preview fields, authentication, and the version URL behavior. Added an offline deployment dry-run step to website CI.
