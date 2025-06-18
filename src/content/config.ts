import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default("StaubRacing"),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
