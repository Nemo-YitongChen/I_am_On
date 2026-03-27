import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

function hasContentDirectory(relativePath) {
  return existsSync(fileURLToPath(new URL(relativePath, import.meta.url)));
}

const collections = {};

if (hasContentDirectory("./content/work")) {
  collections.work = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      summary: z.string(),
      year: z.string().optional(),
      order: z.number().default(100),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
    }),
  });
}

if (hasContentDirectory("./content/posts")) {
  collections.posts = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      summary: z.string(),
      publishedAt: z.coerce.date(),
      order: z.number().default(100),
      tags: z.array(z.string()).default([]),
    }),
  });
}

export { collections };
