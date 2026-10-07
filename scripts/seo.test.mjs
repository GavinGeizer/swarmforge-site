import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { indexNowKey } from "../src/lib/indexnow.ts";
const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const origin = "https://getswarmforge.tech";
const decode = value => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const locs = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
const htmlFiles = [];
async function walk(path, prefix = "") {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) await walk(join(path, entry.name), relative);
    else if (entry.name.endsWith(".html")) htmlFiles.push(relative);
  }
}
await walk(dist);
const pages = new Map();
for (const file of htmlFiles) {
  const path = file === "index.html" ? "/" : file.endsWith("/index.html") ? `/${file.slice(0, -10)}` : `/${file}`;
  pages.set(path, await readFile(join(dist, file), "utf8"));
}
const index = await readFile(join(dist, "sitemap-index.xml"), "utf8");
const sitemapUrls = [];
for (const url of locs(index)) {
  assert.equal(new URL(url).origin, origin);
  sitemapUrls.push(...locs(await readFile(join(dist, new URL(url).pathname), "utf8")));
}
const titles = new Set(), descriptions = new Set();
for (const [path, html] of pages) {
  test(`Rendered page metadata and semantics: ${path}`, () => {
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.equal([...html.matchAll(/<main\b/g)].length, 1);
    assert.match(html, /<html lang="en"/);
    const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "");
    const description = decode(html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "");
    assert.ok(title.includes("SwarmForge") && title.length < 100);
    assert.ok(description.length > 0 && description.length <= 210);
    assert.ok(!titles.has(title), `Duplicate title: ${title}`); titles.add(title);
    assert.ok(!descriptions.has(description), `Duplicate description: ${description}`); descriptions.add(description);
    if (path === "/404.html") {
      assert.match(html, /name="robots" content="noindex"/);
      assert.doesNotMatch(html, /rel="canonical"/);
      assert.ok(!sitemapUrls.includes(`${origin}${path}`));
      return;
    }
    assert.match(html, new RegExp(`rel="canonical" href="${origin.replaceAll(".", "\\.")}${path}"`));
    assert.ok(sitemapUrls.includes(`${origin}${path}`), `Missing canonical page ${path}`);
    assert.doesNotMatch(html, /name="robots" content="noindex"/);
    assert.match(html, /property="og:image" content="https:\/\/getswarmforge.tech\/assets\/social-card.png"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1] ?? "null");
    assert.equal(graph["@context"], "https://schema.org");
    assert.ok(graph["@graph"].some(node => node["@type"] === "WebSite"));
    if (path !== "/") { assert.ok(graph["@graph"].some(node => node["@type"] === "BreadcrumbList")); assert.match(html, /aria-label="Breadcrumb"/); }
    assert.doesNotMatch(html, /\sstyle=/, "Inline styles conflict with the production CSP");
    let previous = 0;
    for (const match of html.matchAll(/<h([1-6])\b/g)) { const level = Number(match[1]); assert.ok(level <= previous + 1, `Skipped heading level ${previous} → ${level}`); previous = level; }
    assert.ok(!/<script(?![^>]*type="application\/ld\+json")(?![^>]*src=)[^>]*>/.test(html), "Unexpected executable inline script");
  });
}
test("Generated sitemap includes exactly the public canonical HTML pages", () => {
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
  assert.equal(sitemapUrls.length, [...pages.keys()].filter(path => path !== "/404.html").length);
  for (const value of sitemapUrls) { const url = new URL(value); assert.equal(url.origin, origin); assert.ok(pages.has(url.pathname)); assert.ok(!url.search && !url.hash); }
});
test("Every local link and fragment resolves in the production output", async () => {
  for (const [path, html] of pages) for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const value = decode(match[1]);
    if (!value.startsWith("/") && !value.startsWith("#")) continue;
    const url = new URL(value, `${origin}${path}`);
    if (url.pathname === "/sitemap.xml") continue; // Permanent Cloudflare redirect.
    const target = pages.get(url.pathname);
    if (target) {
      if (url.hash) assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing fragment ${value} from ${path}`);
    } else { await readFile(join(dist, url.pathname)); }
  }
});
test("FAQ structured answers match visible questions and answers", () => {
  const html = pages.get("/faq/");
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
  const faq = graph["@graph"].find(node => node["@type"] === "FAQPage");
  assert.ok(faq.mainEntity.length >= 9);
  const visible = decode(html.replace(/<script\b[^>]*>.*?<\/script>/gs, "").replace(/<[^>]*>/g, ""));
  for (const question of faq.mainEntity) { assert.ok(visible.includes(question.name)); assert.ok(visible.includes(question.acceptedAnswer.text)); }
});
test("Software entity has verified repository and no invented license or reviews", () => {
  const graph = JSON.parse(pages.get("/").match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
  const app = graph["@graph"].find(node => Array.isArray(node["@type"]) && node["@type"].includes("SoftwareApplication"));
  assert.ok(app["@type"].includes("SoftwareSourceCode"));
  assert.equal(app.codeRepository, "https://github.com/GavinGeizer/swarmforge-oss");
  for (const property of ["license", "aggregateRating", "review", "offers", "creator"]) assert.equal(app[property], undefined);
});
test("Crawler policy explicitly allows search without changing training policy", async () => {
  const robots = await readFile(join(dist, "robots.txt"), "utf8");
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \/\n/);
  assert.match(robots, /User-agent: \*\nAllow: \/\n/);
  assert.doesNotMatch(robots, /^User-agent: GPTBot/m);
  assert.match(robots, /Sitemap: https:\/\/getswarmforge.tech\/sitemap-index.xml/);
});
test("Machine-readable navigation and reference match published concept pages", async () => {
  const nav = await readFile(join(dist, "llms.txt"), "utf8");
  const full = await readFile(join(dist, "llms-full.txt"), "utf8");
  assert.match(nav, /No original orchestration benchmark results/);
  assert.match(nav, /no license has been published/i);
  for (const match of nav.matchAll(/\]\((https:\/\/getswarmforge.tech[^)]+)\)/g)) {
    const url = new URL(match[1]);
    assert.ok(pages.has(url.pathname) || url.pathname === "/llms-full.txt", `Unknown LLM link ${url}`);
  }
  for (const [path, html] of pages) if (html.includes('"@type":"TechArticle"')) {
    assert.ok(nav.includes(`${origin}${path}`));
    assert.ok(full.includes(`Canonical page: ${origin}${path}`));
  }
  assert.doesNotMatch(full, /^title: /m);
});
test("Social preview is a real 1200×630 PNG", async () => {
  const png = await readFile(join(dist, "assets/social-card.png"));
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
test("Installer remains unchanged and old sitemap redirects", async () => {
  assert.equal(await readFile(join(root, "public/install"), "utf8"), await readFile(join(dist, "install"), "utf8"));
  assert.match(await readFile(join(dist, "_redirects"), "utf8"), /^\/sitemap.xml \/sitemap-index.xml 301/m);
});

test("IndexNow key is opt-in and rejects unsafe path values", () => {
  assert.equal(indexNowKey(undefined), undefined);
  assert.equal(indexNowKey("0123456789abcdef"), "0123456789abcdef");
  for (const value of ["short", "../badkey", "llms-full", "a".repeat(129)]) assert.throws(() => indexNowKey(value));
});
