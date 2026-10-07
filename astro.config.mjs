import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://getswarmforge.tech",
  output: "static",
  integrations: [sitemap({ filter: (page) => !["/404/", "/404.html"].includes(new URL(page).pathname) })],
  trailingSlash: "always",
  build: { inlineStylesheets: "never" },
  markdown: { syntaxHighlight: false },
});
