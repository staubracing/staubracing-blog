import { defineCollection, z } from "astro:content";
import categoriesJson from "./categories.json";

// Define category types for better TypeScript support
export const CATEGORIES = ["racing", "code", "projects", "life"] as const;
export type Category = (typeof CATEGORIES)[number];

// Category metadata with proper typing
export const CATEGORY_INFO: Record<
  Category,
  {
    emoji: string;
    title: string;
    color: string;
    description: string;
  }
> = categoriesJson.info;

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default("StaubRacing"),
    editor: z.string().optional(), // Optional editor credit
    featured: z.boolean().default(false),
    // Now uses the typed constant
    category: z.enum(CATEGORIES).default("life"),
    series: z.string().optional(), // For multi-part posts like "ZX6R Rebuild"
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
