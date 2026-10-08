import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md, mdx}", base: "../src/content/docs" }),
  schema: z.object({
    title: z.string,
    description: z.string(),
    section: z.string(),
    order: z.number().default(0),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md, mdx}", base: "../src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("PulseTask Team"),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, blog };
