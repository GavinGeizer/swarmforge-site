# SEO and retrieval audit — 2026-10-07

## Initial findings (before changes)

Inspected the website source at `15346f0`, live homepage HTML/headers, robots.txt and sitemap.xml, and Firecrawl's public-page map/extraction. Application facts were checked against `swarmforge-oss` README, architecture, MCP API, configuration, artifacts, metrics and worker protocol.

- Astro 7 static output already exposes full page content without JavaScript. Only two substantive routes existed: `/` and `/docs/`. The 404 is noindex. No private/admin/API routes exist in this website; the application server is separate.
- Shared layout already supplies title, description, canonical and basic Open Graph. Each page has one H1 and semantic navigation/main/footer. Skip link, focus styles and reduced-motion preference exist.
- Homepage title and lead copy explain workspaces without clearly naming AI coding agent orchestration or the project entity. Marketing headings are strong but need factual supporting statements.
- Manually maintained sitemap has two URLs. No automatic route discovery, structured data, social image/card, FAQ, concept pages or llms navigation files exist.
- Robots allows all crawlers. No distinct training-crawler preference is established. OAI-SearchBot can be explicit without changing GPTBot's inherited permission.
- Static HTML, system fonts, a small deferred clipboard script and no third-party browser dependencies are good foundations. No field Core Web Vitals measurements were available; source inspection cannot establish actual LCP/INP/CLS scores.
- Concept and architecture documentation lives on GitHub rather than on canonical website URLs. Setup material is substantial; no mass thin-content strategy is needed.
- No license file was found in the application repo. Do not assert an SPDX license, pricing, legal organization, creator identity, reviews or ratings in JSON-LD without evidence. The owner's “open-source” positioning needs a published license.
- Current workers use OpenCode in Freestyle VMs. MCP management is a separate role. No native Codex/Claude Code worker backend, local-VM backend, per-spawn model/repository selection, automatic PR creation or published orchestration benchmark is established.

## Implementation design

Keep the existing homepage artwork, typography, colors and marketing H1. Add a declarative product description and practical internal links. Extend the existing layout for canonical entities, social metadata and visible breadcrumbs. Use Astro's sitemap integration and typed Markdown content collections for substantive concepts, architecture, real use cases and benchmark methodology. Generate llms navigation/reference from the same published content; avoid separate hand-maintained copies. Keep FAQ answers and matching schema in one data source. Prepare opt-in IndexNow tooling, with no submission or credential claims. See the final report below for validation and owner setup.

## Implemented changes

- Kept the marketing H1, dashboard illustration, typography, palette and homepage structure; added clear product/category text, updated title/description, practical workflow links and current runtime/provider scope.
- Shared canonical metadata, Open Graph and large social card, plus WebSite/WebPage, SoftwareApplication + SoftwareSourceCode, TechArticle, visible BreadcrumbList and visible FAQPage JSON-LD. No fabricated Organization, creator, pricing, license, review or rating fields.
- Official Astro sitemap integration covers 15 public canonical HTML pages; old `/sitemap.xml` redirects to the generated index. 404/non-HTML/draft outputs are omitted.
- Explicit OAI-SearchBot allowance; GPTBot retains the original wildcard policy. The installer is noindex, not a landing page. No private/admin routes were added.
- Eleven substantial source-grounded Markdown guides define concepts, architecture, two workflows and benchmark methodology. Each begins with a declarative definition and links implementation sources and related content. FAQ and use-case navigation add two further public pages.
- llms navigation and full technical reference are generated from the same published guides and FAQ. A shared publication gate excludes drafts from routes, indexes and machine-readable output.
- Future benchmark/comparison/use-case routing works through the existing collection and static route renderer; no empty comparison, hackathon or results pages were published.
- Optional environment-driven IndexNow verification file and explicit dry-run/submit tooling. No service registration, external notification or hardcoded key.
- Source-only performance foundations preserved: static HTML, system fonts, no hydration framework, no external browser libraries. The social image is referenced only in metadata. Native mobile/desktop layout checks were added to validation; no field CWV score is claimed.
- Corrected a caption overlap and clarified the illustration claim to “Preserved files survive VM cleanup.” Disabled default inline Markdown highlighting to respect the existing CSP; code samples use the branded external stylesheet.
- Added official sitemap runtime dependency and Astro check/TypeScript development tools. Rendered-output tests use Node's built-in test runner; no test/lint framework dependency was added.

## Validation

- `npm run check:syntax`: passed, including Bash installer and browser/maintenance/test JavaScript syntax.
- `npm run check`: Astro template/type checking passed, zero errors, warnings or hints.
- `npm run build`: production static build passed; 15 canonical public HTML pages plus noindex 404 and generated text/XML outputs.
- `npm test`: 25 checks cover metadata uniqueness, canonical sitemap coverage, heading hierarchy, internal links/fragments, JSON-LD, visible FAQ parity, crawler policy, machine-readable references, social image, installer preservation, IndexNow validation and absence of CSP-blocked inline styles.
- Optional IndexNow build was exercised with a local fixture key. Generated key file and dry-run succeeded without network requests. The final default build contains no fixture key.
- Chromium inspected homepage, setup, metrics, FAQ and methodology at mobile/desktop widths. Original 390/1280 checks passed; final checks also cover 320px under Cloudflare's local static-assets server.
- Local Wrangler serving verified HTTP 301 for old sitemap, HTTP 404 for unknown routes, plaintext MIME types, installer noindex and the retained CSP. `npm run deploy -- --dry-run` passed without uploading.
- Native independent review found an inline-highlighting/CSP conflict; fixed and guarded by a regression assertion. Follow-up review found no remaining important issues.
- Check/build commands must be run sequentially because they share Astro's generated content cache. One initial simultaneous check/build attempt collided on a cache temp-file rename; sequential runs passed without source changes.

## Deliberate omissions and deployment status

The owner confirmed no license has been chosen. “Open source” was replaced with public-source wording where necessary; no license was added. Actual benchmark results, datasets, comparisons and customer/speedup claims need evidence. Legal organization/creator identity was not inferred from a GitHub account. No Google/Bing account, verification record, search submission, IndexNow notification or Cloudflare production deployment was performed. These source changes are validated. The owner requested publication to the website repository's `main` branch; production deployment and search-service verification remain separate follow-up checks.

## Next content, ordered by expected usefulness

1. A reproducible first-task walkthrough with exact release/snapshot configuration, input, artifacts and independently checked outcome.
2. An original parallel-versus-sequential orchestration study with a controlled task set, repetitions, correctness grading, interventions and full time/cost/token reporting.
3. Verified MCP-manager connection guides for actual Codex and Claude Code clients, keeping those clients distinct from OpenCode worker execution.
4. A real repository-review case study with a fixed commit, reproduced findings and false-positive/coverage discussion.
5. Evidence-backed comparison pages explaining responsibility boundaries and tested behavior, without invented rankings or performance claims.
6. A documented local-model deployment example with real reachability/protocol checks; publish local-VM material only after a supported backend exists.

Expected impact is a content-prioritization judgment, not a promised ranking forecast. Publish the project license before returning to licensed-open-source positioning.

## Copy clarification notes

The original hero explained workspaces without naming orchestration; a factual supporting paragraph now names autonomous coding agents, parallel workers, OpenCode and MCP. “Open source” lacked a published license and was corrected. “Work survives the workspace” was broader than artifact durability and now specifies preserved files. Do not describe configured worker capacity as proven scale, estimates as billing/spending enforcement, team labels as security tenants, self-hosting as local worker support, or MCP management as native Codex/Claude Code execution.

## Changed files

- `.github/workflows/check.yml`
- `README.md`
- `astro.config.mjs`
- `docs/CONTENT-GUIDE.md`
- `docs/SEARCH-SETUP.md`
- `docs/SEO-GEO.md`
- `package-lock.json`
- `package.json`
- `public/_headers`
- `public/_redirects`
- `public/assets/social-card.png`
- `public/assets/social-card.svg`
- `public/robots.txt`
- `public/sitemap.xml`
- `scripts/indexnow.mjs`
- `scripts/seo.test.mjs`
- `src/components/Breadcrumbs.astro`
- `src/components/DashboardExample.astro`
- `src/components/SiteFooter.astro`
- `src/content.config.ts`
- `src/content/guides/architecture.md`
- `src/content/guides/benchmarks.md`
- `src/content/guides/docs/artifacts.md`
- `src/content/guides/docs/managers.md`
- `src/content/guides/docs/metrics.md`
- `src/content/guides/docs/providers.md`
- `src/content/guides/docs/repositories.md`
- `src/content/guides/docs/tasks.md`
- `src/content/guides/docs/workers.md`
- `src/content/guides/use-cases/parallel-development.md`
- `src/content/guides/use-cases/repository-review.md`
- `src/layouts/SiteLayout.astro`
- `src/lib/faq.ts`
- `src/lib/guides.ts`
- `src/lib/indexnow.ts`
- `src/lib/llms.ts`
- `src/lib/site.ts`
- `src/pages/[...slug].astro`
- `src/pages/[indexnowKey].txt.ts`
- `src/pages/docs/index.astro`
- `src/pages/faq.astro`
- `src/pages/index.astro`
- `src/pages/llms-full.txt.ts`
- `src/pages/llms.txt.ts`
- `src/pages/use-cases/index.astro`
- `src/styles/site.css`
