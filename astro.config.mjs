import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://www.staubracing.com",
  outDir: "./dist",
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  integrations: [mdx()],
  vite: {
    publicDir: "public",
  },
  build: {
    inlineStylesheets: "auto",
  },
});
