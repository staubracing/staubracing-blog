# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Staub Racing is a consolidated personal site built with Astro 5, featuring motorcycle racing content, coding projects, DIY builds, and life updates. The site uses static generation with MDX support and deploys to AWS S3 + CloudFront at `staubracing.com`.

**Migration Status:** Consolidating the legacy static HTML site and blog into a unified Astro codebase. See `staubracing-migration-plan.md` for phased implementation.

## Quick Start

```bash
yarn install              # Install dependencies
yarn dev                  # Start development server (http://localhost:4321)
```

## Commands

```bash
yarn dev          # Start development server (http://localhost:4321)
yarn build        # Build for production (outputs to dist/)
yarn preview      # Preview production build locally
yarn astro check  # TypeScript validation
```

### Deployment
Deployed automatically via GitHub Actions on push to `main`:
- Builds with `astro build`
- Syncs `dist/` to AWS S3
- Invalidates CloudFront cache

No manual deploy command needed — just `git push`.

### Media Helper Scripts
```bash
node scripts/add-images.js create-folders           # Scaffold category directories
node scripts/add-images.js generate-html <post>      # Print Markdown snippets for images
```

**Image organization:** Blog images follow the pattern `public/images/blog/{category}/{post-slug}/`. Use the helper script above to scaffold folders and generate HTML snippets.

Before committing changes, run `yarn build` and `yarn preview` to verify.

## File Conventions

- **Pages**: kebab-case (`about.astro`, `blog/[...slug].astro`)
- **Components**: PascalCase (`MediaDisplay.astro`, `ThemeToggle.astro`)
- **Blog posts**: kebab-case slugs, organized by category in `src/content/blog/{category}/`
- **Indentation**: 2 spaces

### Directory Structure

```
staubracing.com/
├── public/
│   └── images/
│       ├── blog/          # Blog images by {category}/{slug}/
│       └── gallery/       # Racing gallery and site assets
├── scripts/
│   └── add-images.js      # Media helper for blog post images
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable cards and UI elements
│   │   │   ├── BikeCard.astro
│   │   │   ├── BlogPostCard.astro
│   │   │   ├── StatCard.astro
│   │   │   └── LinkCard.astro
│   │   ├── Nav.astro      # Main navigation
│   │   ├── SubNav.astro   # Contextual sub-navigation
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   └── MediaDisplay.astro
│   ├── content/
│   │   ├── blog/          # Blog posts organized by category
│   │   ├── categories.json
│   │   └── config.ts      # Content collection schema
│   ├── data/              # Static data files (bike specs, links, etc.)
│   ├── layouts/
│   │   └── BaseLayout.astro  # Shared page shell
│   ├── pages/
│   │   ├── index.astro       # Home
│   │   ├── racing.astro      # Racing section
│   │   ├── projects.astro    # Projects section
│   │   ├── code.astro        # Code section
│   │   ├── life.astro        # Life section
│   │   ├── contact.astro     # Contact page
│   │   ├── links.astro       # Links hub
│   │   ├── blog/[...slug].astro
│   │   └── category/[category].astro
│   └── styles/
└── astro.config.mjs       # Site config (URL: https://staubracing.com)
```

## Content Collections

Blog posts use Astro's content collection system with schema validation in `src/content/config.ts`. Required frontmatter fields:
- `title` - Post title
- `date` - Publication date
- `tags` - Array of tags
- `category` - One of: racing, code, projects, life
- `draft` - Boolean (true for WIP posts, excluded from builds)

**Draft posts:** Setting `draft: true` excludes the post from production builds. Draft posts are still visible during development (`yarn dev`).

Categories are configured in `src/content/categories.json` with associated emojis and colors.

## Architecture

### Site Structure
Main navigation: Home, Racing, Projects, Code, Life, Contact

Each section page (racing, projects, code, life) aggregates blog posts from its category and may include section-specific content.

### Routing
- File-based routing in `src/pages/`
- Static pages: `index.astro`, `racing.astro`, `projects.astro`, `code.astro`, `life.astro`, `contact.astro`, `links.astro`
- Dynamic: `blog/[...slug].astro` for posts, `category/[category].astro` for category listings

### Styling
- CSS custom properties in `src/styles/theme.css` for theming
- Dark mode by default, light mode via `ThemeToggle` component
- Racing theme with green accents (#1a8754)
- Glassmorphism effects with backdrop filters
- Mobile-first responsive design

### Layouts
- `src/layouts/BaseLayout.astro` — Shared page shell (head, meta, fonts, nav, footer)

### Key Components
- `Nav.astro` — Main navigation with section links
- `SubNav.astro` — Contextual sub-navigation per section
- `ThemeToggle.astro` — Dark/light mode switching with localStorage persistence
- `MediaDisplay.astro` — Renders images, videos, and embedded content
- Card components: `BikeCard`, `BlogPostCard`, `StatCard`, `LinkCard`

## Commit Style

Use imperative sentence case: "Revise homepage content..." or "Add new blog post about..."

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Astro 5 |
| Content | Markdown/MDX with frontmatter |
| Styling | CSS with custom properties |
| Hosting | AWS S3 (static files) |
| CDN | AWS CloudFront |
| DNS | AWS Route 53 |
| SSL | AWS Certificate Manager |
| CI/CD | GitHub Actions |
| Package Manager | Yarn |

## Migration Reference

The site is being migrated from a two-site setup (static HTML + blog subdomain) to a unified Astro codebase. Key migration tasks are tracked in `staubracing-migration-plan.md`:

- **Phase 1**: Foundation — Layout components, routing structure, design system
- **Phase 2**: Content migration — Blog posts, bike data, gallery images, links
- **Phase 3**: Home page & polish — Hero, stats, dark/light toggle, responsiveness
- **Phase 4**: AWS deployment — S3 sync, CloudFront config, GitHub Actions
- **Phase 5**: Content cadence — Weekly publishing habit
