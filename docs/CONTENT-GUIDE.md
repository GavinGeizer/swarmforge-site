# Publishing technical and research content

## One maintained source

`src/content/guides/**/*.md` is the source for technical articles. Astro's content collection validates the frontmatter; `[...slug].astro` renders static HTML. The filename determines the canonical route. The same entries generate `/llms.txt` and `/llms-full.txt`, and the sitemap integration discovers built HTML pages. Do not hand-maintain another sitemap or copied machine-readable guide.

Set `draft: true` for unpublished work: draft entries do not generate routes or appear in navigation, sitemap or llms output. Publication is gated by `src/lib/guides.ts`.

Required frontmatter: `title`, `description`, `section`, `order`, `reviewed`, `sources`, `related`. Sections are `docs`, `architecture`, `use-cases`, `benchmarks`, `compare`. Use the actual review date, not a build timestamp. Start the body with a self-contained definition; the layout supplies the only H1. Use H2 for main sections, H3 for subsections. Include implementation references and useful related links. Source repository links deliberately follow `master`; pin commits when documenting a specific release or experiment.

Use cases automatically appear in `/use-cases/`; concepts appear in `/docs/`; all guides appear in llms navigation. The layout provides breadcrumbs and a related-guides block. Comparison articles may use `compare/codex.md`, `compare/claude-code.md` or `compare/opencode.md` after facts are verified. No comparison landing pages are generated before content exists. Future hackathon content belongs in `use-cases/hackathons.md` when a reproducible workflow or actual case study is available.

## Benchmark results

`/benchmarks/` currently contains a substantial reporting methodology, not a results placeholder. To publish a completed study, create `benchmarks/<study-id>.md`. Include:

- question and versioned task set, repositories and base commits;
- date, SwarmForge/OpenCode versions and commits;
- exact model/provider, inference settings, manager prompts and tool permissions;
- VM provider, snapshot, hardware/resources, environment, concurrency, queue and timeouts;
- independent grading rule, completion numerator/denominator, repetitions, exclusions and uncertainty;
- queue/provision/coding/review/end-to-end times;
- actual charges separately from estimates, rate date and unpriced usage;
- input/output/reasoning/cache token categories and measurement source;
- interventions, retries, failures and recovery actions;
- original result records, artifacts, test evidence and handoff commits, with secrets/private content removed.

Link every results article from the benchmark methodology page. Compare products only under documented, equivalent conditions. Never convert configured capacity into a measured throughput claim. Use `TechArticle` for methodology or narrative studies; add `Dataset` only if a real downloadable dataset exists with verified provenance/license. Add authors, publication dates and licenses only when verified.

## Metadata and verification

All pages use `SiteLayout.astro`; extend it rather than adding a second SEO plugin. Project constants and entity JSON-LD are in `src/lib/site.ts`. FAQ visible content and structured answers share `src/lib/faq.ts`. The application license field links the official PolyForm Small Business 1.0.0 terms. Ratings, offers, unsupported creator/organization and unsupported integrations are intentionally absent.

The social card is checked-in PNG plus its editable SVG source, not a runtime image request. After changing the SVG, regenerate a 1200×630 PNG and run the tests. No browser downloads of fonts, social scripts or analytics are required.

Run these sequentially (Astro commands share a generated content cache):

```bash
npm run check:syntax
npm run check
npm run build
npm test
npm run deploy -- --dry-run
```

`npm test` reads the production output; build first. It checks titles, descriptions, canonical pages, sitemap coverage, heading levels, local links/fragments, schema, FAQ parity, llms links and social-image dimensions. There was no existing lint/typecheck/test suite before this pass beyond shell/JavaScript syntax and the production build. Astro check and dependency-free Node tests were added; no additional lint framework was introduced.
