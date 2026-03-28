import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const bookingOptions = defineCollection({
  loader: file("./src/content/site/booking-options.json"),
  schema: z.object({
    id: z.string(),
    lang: z.enum(["zh", "en"]),
    name: z.string(),
    duration: z.string(),
    teaser: z.string(),
    url: z.string().url(),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),
  }),
});

const site = defineCollection({
  loader: file("./src/content/site/profile.json"),
  schema: z.object({
    id: z.string(),
    brand: z.string(),
    ownerName: z.string(),
    location: z.string().optional(),
    tagline: z.object({
      zh: z.string(),
      en: z.string(),
    }),
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    linkedin: z.string().url(),
    github: z.string().url().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    role: z.string(),
    year: z.string(),
    order: z.number().default(100),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const posts = defineCollection({
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

export const collections = { bookingOptions, site, work, posts };
