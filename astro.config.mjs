import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://staubracing.github.io/staubracing-blog/",
  base: import.meta.env.PROD ? "/staubracing-blog/" : undefined,
  outDir: "./dist",
});
