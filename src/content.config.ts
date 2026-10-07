import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    draft: z.boolean().default(false),
    title: z.string(),
    description: z.string(),
    section: z.enum(["docs", "architecture", "use-cases", "benchmarks", "compare"]),
    order: z.number(),
    reviewed: z.string(),
    sources: z.array(z.url()).min(1),
    related: z.array(z.object({ title: z.string(), path: z.string() })),
  }),
});
export const collections = { guides };
