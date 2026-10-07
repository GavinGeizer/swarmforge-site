# SwarmForge website and installer delivery

## Scope

Independent repository at /home/overlord/swarmforge-site. Cloudflare Pages builds Astro and deploys only dist/. The application repository remains GavinGeizer/swarmforge-oss; GitHub Releases hold versioned binaries. No real SwarmForge/provider/model endpoint calls, no service restarts, and no secret material in the site.

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
- [ ] Create and push GitHub website repository
- [x] Build and verify release archive plus external checksum
- [ ] Prepare first GitHub draft release for review
- [x] Document precise Cloudflare deployment settings and remaining user steps

## Progress

- Domain addition and registrar nameserver change completed by user.
- User requested a separate website directory/repository. Application working-tree skill/research changes are preserved.

- Static checks: Bash parser and browser JavaScript parser/compiler pass. Application TypeScript/Biome checks pass. No new tests or local test suite execution. Installer has not been run against a real release or provider.
- Independent native read-only review found two PATH issues: colon-containing install directories and custom Zsh/Fish configuration roots. Fixed by rejecting invalid PATH components and honoring absolute ZDOTDIR/XDG_CONFIG_HOME, with manual guidance for relative roots. Archive/checksum/release contract aligns; no further important issues identified by inspection.

## Publication status

Local implementation and static/build checks are complete. GitHub publication is blocked by server errors: `gh repo create` twice returned GraphQL internal errors; the REST create fallback returned an empty/invalid response; a subsequent repository lookup confirms the website repo still does not exist. Application `git push origin master` twice returned remote Internal Server Error; origin/master remains at a9493b1. No release has been published or drafted. GitHub's public status page currently says operational, so no global outage is asserted.

Application commit: 0233a48 (external archive checksum workflow and website deployment docs). Global binary rebuilt/installed from that commit; running service left unchanged. Verified package: /home/overlord/swarmforge/dist/swarmforge-v0.1.0-linux-x64-glibc.tar.gz, plus .sha256, SHA256SUMS and metadata-0.1.0.json. Installer/runtime behavior was reviewed but not executed end-to-end; no local tests were added or run.

### Resume publication after GitHub writes work

1. From the application checkout: `git push origin master`.
2. From the website checkout: `gh repo create GavinGeizer/swarmforge-site --public --source . --remote origin --push` (first check that an earlier attempt has not created it).
3. Review the application CI. Create/push a matching v0.1.0 release tag to run the existing release workflow and create its verified draft, or upload the locally verified assets as a draft targeting application commit 0233a48.
4. Review and explicitly publish the draft. Publishing is not automatic.
5. Connect Cloudflare Pages using the exact README settings, then attach getswarmforge.tech through the project's Custom domains.
6. Only after a stable release and Pages deployment exist, advertise the public curl command. Confirm script headers and download behavior before promoting it.

## Framework migration — requested by user

- [x] Verified Cloudflare framework support and its Astro build/output settings against official documentation.
- [x] Migrated homepage, documentation and 404 into Astro routes; added reusable layout, header/footer, dashboard example and installation command components.
- [x] Pinned Astro 7.3.6 and generated npm lockfile; selected Node 24 for builds.
- [x] Kept public/install and public/_headers unchanged; compiled output copies both byte-for-byte.
- [x] Production Astro build and Bash/JavaScript syntax checks pass; no test suite was added or run.
- [x] Updated Cloudflare settings and CI to Astro / npm run build / dist.
- GitHub publication and Cloudflare account connection remain separate outstanding deployment steps; their earlier failures are recorded above.

- Framework review: no important issue in deployment settings, route output, CSP or copied installer. Reviewer found the documented Node minimum did not cover a locked dependency's newer minimum; the project now explicitly requires Node 24, matching CI/Cloudflare. The 404 header's workflow link now returns to the homepage section.
