# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/` with Astro routes under `src/pages`, shared shells in `src/layouts`, and reusable UI such as `MediaDisplay.astro` in `src/components`. Content is organized with Astro Content Collections: blog entries sit in `src/content/blog/{category}/{slug}.mdx|md` and are registered in `src/content/config.ts`. Public assets ship from `public/`, with blog media grouped under `public/images/blog/<category>/<slug>/`. Deployment artifacts are written to `dist/`, while utility scripts (for example, image helpers) live in `scripts/`. Keep docs, screenshots, and long-form notes inside `docs/` to avoid cluttering source directories.

## Build, Test, and Development Commands
Use Yarn for parity with the existing lockfile. `yarn install` prepares dependencies. `yarn dev` launches the Astro dev server with hot reload. `yarn build` outputs a production bundle to `dist/`. `yarn preview` serves the built site for smoke-testing the production build. `yarn deploy` runs the build and publishes `dist/` to GitHub Pages via `gh-pages`. For media workflows, `node scripts/add-images.js create-folders` scaffolds category directories, and `node scripts/add-images.js generate-html racing/zx6r-engine-rebuild` prints Markdown snippets for a post.

## Coding Style & Naming Conventions
Follow Astro’s file-based routing: page files use kebab-case (`about.astro`), while exported components stay PascalCase (`MediaDisplay.astro`). Favor TypeScript where available (`interface Props`) and keep two-space indentation to match current files. Frontmatter in blog entries should include `title`, `date`, `tags`, `category`, and `draft` when work is in progress. Prefer semantic HTML and utility CSS within `<style>` blocks; scope component styles locally unless a global token already exists.

## Testing Guidelines
There is no automated test suite yet, so rely on manual review. Before committing, run `yarn build` and `yarn preview` to confirm pages render without runtime warnings. Use Astro’s built-in diagnostics with `yarn astro check` when adjusting TypeScript definitions or content schemas. Validate new posts by hitting their route in the dev server and verifying that frontmatter-derived metadata (category, featured flag) renders as expected.

## Commit & Pull Request Guidelines
Commits in this repo are sentence-case imperatives (for example, `Revise homepage content in index.astro …`) and group related edits in a single change, sometimes using a semicolon to call out secondary updates. Reflect that style: start with a concise verb phrase, then note any secondary file touchpoints. Pull requests should include a short summary of the change, link to the corresponding issue or blog entry if applicable, list manual checks (e.g., “`yarn build` ✅”), and attach before/after screenshots for visual updates.

## Content Workflow Tips
Place new articles under the matching category inside `src/content/blog/`. Name Markdown files with kebab-case slugs (`life/my-new-project.md`) to keep URLs predictable. Use the helper script to scaffold image folders before uploading assets. Set `draft: true` until the post is ready, then clear it prior to merging so `astro build` includes the entry.
