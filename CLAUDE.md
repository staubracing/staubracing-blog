# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

StaubRacing Blog is a personal blog built with Astro 5, featuring content about motorcycle racing, coding projects, DIY builds, and life updates. The site uses static generation with MDX support and deploys to GitHub Pages.

## Commands

```bash
yarn dev          # Start development server (http://localhost:4321)
yarn build        # Build for production (outputs to dist/)
yarn preview      # Preview production build locally
yarn deploy       # Build and deploy to GitHub Pages
```

### Media Helper Scripts
```bash
node scripts/add-images.js create-folders           # Scaffold category directories
node scripts/add-images.js generate-html <post>      # Print Markdown snippets for images
```

Before committing changes, run `yarn build` and `yarn preview` to verify. Use `yarn astro check` for TypeScript validation.

## File Conventions

- **Pages**: kebab-case (`about.astro`, `blog/[...slug].astro`)
- **Components**: PascalCase (`MediaDisplay.astro`, `ThemeToggle.astro`)
- **Blog posts**: kebab-case slugs, organized by category in `src/content/blog/{category}/`
- **Indentation**: 2 spaces

## Content Collections

Blog posts use Astro's content collection system with schema validation in `src/content/config.ts`. Required frontmatter fields:
- `title` - Post title
- `date` - Publication date
- `tags` - Array of tags
- `category` - One of: racing, code, projects, life
- `draft` - Boolean (true for WIP posts, excluded from builds)

Categories are configured in `src/content/categories.json` with associated emojis and colors.

## Architecture

### Routing
- File-based routing in `src/pages/`
- `[...slug].astro` - Dynamic blog post routing
- `[category].astro` - Category listing pages

### Styling
- CSS custom properties in `src/styles/theme.css` for theming
- Dark mode by default, light mode via `ThemeToggle` component
- Racing theme with green accents (#1a8754)
- Glassmorphism effects with backdrop filters

### Layouts
- `src/layouts/Layout.astro` - Main wrapper with header, nav, theme toggle, footer

### Key Components
- `ThemeToggle.astro` - Dark/light mode switching with localStorage persistence
- `MediaDisplay.astro` - Renders images, videos, and embedded content

## Commit Style

Use imperative sentence case: "Revise homepage content..." or "Add new blog post about..."

## Tech Stack

- Astro 5.14.1 (static site generator)
- MDX for content
- TypeScript for type safety
- CSS with custom properties
- Yarn package manager
- gh-pages for deployment
