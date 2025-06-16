import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    // Add more fields as needed (e.g., description, tags)
  }),
});

export const collections = { blog };
