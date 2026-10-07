import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://getswarmforge.tech",
  output: "static",
  trailingSlash: "always",
  build: { inlineStylesheets: "never" },
});
