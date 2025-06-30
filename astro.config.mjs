import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://staubracing.github.io/staubracing-blog/",
  base: import.meta.env.PROD ? "/staubracing-blog/" : undefined,
  outDir: "./dist",
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  integrations: [mdx()],
});
