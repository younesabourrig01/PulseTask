import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/docs" }),
  schema: z.object({
    title: z.string(), // Fixed: added parentheses ()
    description: z.string(),
    section: z.string(),
    order: z.number().default(0),
  }),
});

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blogs" }), // Fixed: changed to "blogs" and removed "../"
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("PulseTask Team"),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, blogs };