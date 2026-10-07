# Search and retrieval setup after deployment

No search service account, domain verification, sitemap submission or IndexNow notification was configured by this implementation. These require owner action. The built site is ready to submit after it is deployed to the canonical domain.

## 1. Confirm the production deployment

- Open the homepage, `/docs/`, `/architecture/`, `/faq/` and `/benchmarks/` without a login or bot challenge.
- Verify `/robots.txt`, `/sitemap-index.xml`, `/sitemap-0.xml`, `/llms.txt`, `/llms-full.txt` and `/assets/social-card.png` return the intended content and MIME type.
- `/sitemap.xml` permanently redirects to `/sitemap-index.xml` for existing submissions.
- Check a nonexistent URL returns an HTTP 404 with the noindex error page, not a 200 “page not found.”
- Ensure alternate production hosts (www, http, workers.dev or pages.dev) redirect to `https://getswarmforge.tech` where appropriate. Canonical tags already point there, but DNS/host redirects require Cloudflare configuration. Keep intentional preview URLs usable; do not broadly redirect development previews.
- Review Cloudflare WAF, Bot Fight Mode, managed robots, AI crawler settings and any content-signal policy. Repository robots allow search crawling but an edge rule can still block verified bots. Do not disable security or change training policy blindly.

## 2. Google Search Console

Add a Domain property for `getswarmforge.tech`. Copy Google's supplied verification TXT record into the Cloudflare DNS zone and verify ownership. A domain property covers HTTP/HTTPS and subdomains. Keep the verification record.

Submit `https://getswarmforge.tech/sitemap-index.xml`. Inspect the homepage and representative new pages, review Google's selected canonical and request indexing when appropriate. Monitor Page indexing, Crawl stats, Web search performance and Core Web Vitals as field data accumulates. Validate rendered JSON-LD with Google's Rich Results Test/schema tools, but do not assume every valid schema produces a rich result. FAQ rich-result eligibility is limited; FAQ schema is used for truthful content representation here.

Google documents that ordinary SEO foundations also apply to AI Overviews/AI Mode; no special AI text file or schema is required. The llms files are an additional navigation convenience, not a guarantee of retrieval, ranking or recommendation.

Official guidance: [Search Console ownership](https://support.google.com/webmasters/answer/9008080), [sitemap submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [AI search features](https://developers.google.com/search/docs/appearance/ai-features), [FAQ structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage).

## 3. Bing Webmaster Tools

Add `https://getswarmforge.tech/` in Bing Webmaster Tools. Import a verified Search Console property if that option is available, or use Bing's supplied DNS/XML/meta verification. Prefer DNS so no verification ID needs to be checked into the website. Submit the sitemap index and review crawl/indexing reports and URL inspection.

Do not treat a submission acknowledgment as proof that Bing, Copilot or another retrieval system will rank or recommend the project. Official entry point: [Bing Webmaster Tools](https://www.bing.com/webmasters/).

## 4. Optional IndexNow

The opt-in build endpoint emits a root verification file only when `INDEXNOW_KEY` is configured. The key is a public verification value, not an authentication credential. Generate a unique hexadecimal value (8–128 characters), retain it for future builds, and set it in your local shell and Cloudflare build environment:

```bash
export INDEXNOW_KEY="$(openssl rand -hex 16)"
npm run build
npm run indexnow -- --dry-run
```

Do not regenerate it on every deployment. Deploy that build with the same configured value; its root `/<key>.txt` must return the value. Then explicitly run:

```bash
npm run indexnow -- --submit
```

The script reads only canonical URLs from the generated sitemap, verifies the published key and page availability, and submits to `https://api.indexnow.org/indexnow`. Without `--submit`, it performs no network calls. It never runs automatically on build/deploy, and no account credentials or hardcoded key are stored in source. HTTP 200/202 means received/accepted, not indexed. Use it when relevant public pages are added or changed, not as a repeated ranking ping. No notification was sent during this task.

Official protocol: [IndexNow documentation](https://www.indexnow.org/documentation).

## 5. AI retrieval crawler policy

`OAI-SearchBot` is explicitly allowed. `GPTBot` retains the repository's existing wildcard allowance; training policy was not changed. OpenAI documents these as separate controls. Check edge access as well as robots: [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

The public content is static HTML with normal links and independently understandable paragraphs. That supports crawlers that do not execute client JavaScript. There is no universal AI indexing submission API or promised llms.txt support across ChatGPT, Gemini, Perplexity and Copilot.

## 6. Project identity and maintenance

The application now uses PolyForm Small Business License 1.0.0 at its repository root; JSON-LD links the official terms. Keep source-available wording: this standard is not OSI-approved open source. Business eligibility uses fewer than 100 employees and contractors and the prior-tax-year, inflation-adjusted revenue threshold—not the superseded 10-employee draft or a fixed current-year US$1-million figure. Keep exact provider/backend requirements visible. Update source references and FAQ whenever native runtimes, local VM support, per-worker repository/model selection or release availability change.

Record baseline queries, impressions/clicks and referrals after deployment, then assess trends after recrawling. Check actual mobile Core Web Vitals in Search Console rather than treating source-level performance observations as field measurements.
