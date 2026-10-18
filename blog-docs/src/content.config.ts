import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { docsLoader } from "@astrojs/starlight/loaders";

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blogs" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("PulseTask Team"),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, blogs };
