# SwarmForge website and installer delivery

## Scope

Independent repository at /home/overlord/swarmforge-site. Cloudflare Pages deploys only public/. The application repository remains GavinGeizer/swarmforge-oss; GitHub Releases hold versioned binaries. No real SwarmForge/provider/model endpoint calls, no service restarts, and no secret material in the site.

## Design

- Static HTML/CSS/JavaScript; no framework, dependencies, or build tool needed by Cloudflare.
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
- [ ] Independent local Git history and GitHub repository
- [ ] Build release assets and prepare first draft release for review
- [ ] Document precise Cloudflare deployment settings and remaining user steps

## Progress

- Domain addition and registrar nameserver change completed by user.
- User requested a separate website directory/repository. Application working-tree skill/research changes are preserved.

- Static checks: Bash parser and browser JavaScript parser/compiler pass. Application TypeScript/Biome checks pass. No new tests or local test suite execution. Installer has not been run against a real release or provider.
- Independent native read-only review found two PATH issues: colon-containing install directories and custom Zsh/Fish configuration roots. Fixed by rejecting invalid PATH components and honoring absolute ZDOTDIR/XDG_CONFIG_HOME, with manual guidance for relative roots. Archive/checksum/release contract aligns; no further important issues identified by inspection.
