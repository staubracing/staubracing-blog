import { defineCollection, z } from "astro:content";

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
> = {
  racing: {
    emoji: "🏍️",
    title: "Racing & Bikes",
    color: "#e74c3c",
    description: "Track days, race reports, bike builds, setup",
  },
  code: {
    emoji: "💻",
    title: "Code Projects",
    color: "#3498db",
    description: "Apps, tutorials, dev journey",
  },
  projects: {
    emoji: "🔧",
    title: "Projects",
    color: "#f39c12",
    description: "Linux, Raspberry Pi, DIY electronics",
  },
  life: {
    emoji: "📝",
    title: "Life & Updates",
    color: "#2ecc71",
    description: "Personal stuff, thoughts, what I am up to",
  },
};

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
