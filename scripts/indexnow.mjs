import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const host = "getswarmforge.tech";
const origin = `https://${host}`;
const key = process.env.INDEXNOW_KEY;
if (!key || !/^[a-fA-F0-9]{8,128}$/.test(key)) throw new Error("Set INDEXNOW_KEY to 8–128 hexadecimal characters, and rebuild with the same key.");
const args = process.argv.slice(2);
if (args.some(arg => !["--submit", "--dry-run"].includes(arg)) || args.length > 1) throw new Error("Usage: npm run indexnow -- [--dry-run|--submit]");
const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll("&amp;", "&"));
const index = await readFile(`${root}dist/sitemap-index.xml`, "utf8");
const urlList = [];
for (const location of locations(index)) {
  const url = new URL(location);
  if (url.origin !== origin || !/^\/sitemap-\d+\.xml$/.test(url.pathname)) throw new Error("Unexpected sitemap location.");
  urlList.push(...locations(await readFile(`${root}dist${url.pathname}`, "utf8")));
}
const urls = [...new Set(urlList)];
if (!urls.length || urls.length > 10000 || urls.some(value => new URL(value).origin !== origin)) throw new Error("Invalid canonical URL list.");
const keyLocation = `${origin}/${key}.txt`;
if ((await readFile(`${root}dist/${key}.txt`, "utf8")).trim() !== key) throw new Error("Rebuild with the same INDEXNOW_KEY first.");
if (!args.includes("--submit")) {
  console.log(`Dry run: ${urls.length} canonical pages. No network requests or submissions made. Deploy the key file and pages before --submit.`);
} else {
  const proof = await fetch(keyLocation, { redirect: "error", signal: AbortSignal.timeout(15000) });
  if (!proof.ok || (await proof.text()).trim() !== key) throw new Error("The published key file does not match. Deploy this build before submitting.");
  // Avoid announcing new URLs whose current public paths are unavailable.
  for (const url of urls) {
    const response = await fetch(url, { method: "HEAD", redirect: "error", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Canonical page is not available: ${url} (${response.status}).`);
  }
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST", redirect: "error", signal: AbortSignal.timeout(15000), headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
  });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned HTTP ${response.status}.`);
  console.log(`IndexNow accepted ${urls.length} URLs (HTTP ${response.status}); this does not guarantee indexing.`);
}
