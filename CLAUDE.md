# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Staub Racing is a consolidated personal site built with Astro 5, featuring motorcycle racing content, coding projects, DIY builds, and life updates. The site uses static generation with MDX support and deploys to AWS S3 + CloudFront at `staubracing.com`.

**Status:** Migration complete. Unified Astro codebase deployed to AWS.

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

**Production gotcha:** S3/CloudFront serves URLs with trailing slashes (`/about/`) while local dev does not (`/about`). Always normalize paths when comparing `Astro.url.pathname`:
```javascript
const currentPath = Astro.url.pathname.replace(/\/$/, '') || '/';
```

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
│   │   │   └── MaintenanceList.astro
│   │   ├── SocialIcons.astro  # Social links with compact/cards variants
│   │   ├── SubNav.astro
│   │   ├── ThemeToggle.astro
│   │   └── MediaDisplay.astro
│   ├── content/
│   │   ├── blog/          # Blog posts organized by category
│   │   ├── categories.json
│   │   └── config.ts      # Content collection schema
│   ├── data/              # Static data files (bike specs, links, etc.)
│   ├── layouts/
│   │   └── Layout.astro   # Shared page shell (includes nav + footer inline)
│   ├── pages/
│   │   ├── index.astro       # Home
│   │   ├── about.astro       # About page
│   │   ├── racing.astro      # Racing section
│   │   ├── racing/reports.astro # Race reports listing
│   │   ├── workshop.astro    # Workshop section (DIY builds)
│   │   ├── code.astro        # Code section
│   │   ├── code/posts.astro  # Code posts listing
│   │   ├── journal.astro     # Journal section
│   │   ├── calendar.astro    # Event calendar
│   │   ├── maintenance.astro # Public maintenance view
│   │   ├── admin/login.astro       # API key auth
│   │   ├── admin/maintenance.astro # Quick-capture form
│   │   ├── contact.astro     # Contact page
│   │   ├── links.astro       # Links hub
│   │   ├── blog/[...slug].astro
│   │   └── category/[category].astro
│   └── styles/
│       ├── theme.css      # CSS custom properties for theming
│       └── global.css     # Global styles
└── astro.config.mjs       # Site config (URL: https://staubracing.com)
```

## Content Collections

Blog posts use Astro's content collection system with schema validation in `src/content/config.ts`. Required frontmatter fields:
- `title` - Post title
- `date` - Publication date
- `tags` - Array of tags
- `category` - One of: racing, code, projects, life
- `draft` - Boolean (true for WIP posts, excluded from builds)
- `series` - Optional string for multi-part posts (e.g., "ZX6R Rebuild")
- `editor` - Optional editor credit
- `featured` - Boolean for highlighting posts (default: false)

**Draft posts:** Setting `draft: true` excludes the post from production builds. Draft posts are still visible during development (`yarn dev`).

Categories are configured in `src/content/categories.json` with associated emojis and colors.

## Architecture

### Site Structure
Main navigation: Home, Racing, Workshop, Code, Journal, Contact

Each section page (racing, workshop, code, journal) aggregates blog posts from its category and may include section-specific content.

### Routing
- File-based routing in `src/pages/`
- Static pages: `index.astro`, `racing.astro`, `workshop.astro`, `code.astro`, `journal.astro`, `contact.astro`, `links.astro`, `calendar.astro`, `maintenance.astro`
- Admin pages: `admin/login.astro`, `admin/maintenance.astro` (API key auth required)
- Dynamic: `blog/[...slug].astro` for posts, `category/[category].astro` for category listings

### Calendar Integration
The race calendar (`/calendar`) displays Staub Racing's season schedule with a clean event list + toggle to full Google Calendar view.

**Current Status:** Mock data in `src/data/mock-events.ts`. Ready for Google Calendar API integration.

**Calendar Details:**
- **Calendar ID:** `2ee5866170c9db9ff52e5c925cb4d49281e3b1efff7a28d50f1677ffe12d975b@group.calendar.google.com`
- **Event type classification (for API):**
  - `CRA` in title → Race Weekend (🏁 lime badge)
  - `ZARS` in title → Track Day (🔧 blue badge)
  - Other → Track Day (default)

**API Integration TODO:**
1. Create Google Cloud project → Enable Calendar API
2. Generate API key (restrict to Calendar API only)
3. Add `GOOGLE_CALENDAR_API_KEY` to `.env`
4. Replace mock data fetch in `calendar.astro` frontmatter

### Styling
- CSS custom properties in `src/styles/theme.css` for theming
- Dark mode by default, light mode via `ThemeToggle` component
- Racing theme with green accents (#1a8754)
- Glassmorphism effects with backdrop filters
- Mobile-first responsive design

### Page Headers
Section pages use clean, minimal headers with just `h1` and `p` — no redundant category pills. The navigation and theming already provide context.

**Pattern:**
```astro
<header class="section-header">
  <h1>{title}</h1>
  <p>{description}</p>
</header>
```

**Where `.category-pill` IS still used:**
- Homepage featured post cards (each card needs its category label)
- `category/[category].astro` (dynamic category pages)
- `index.astro` post cards

**Where `.category-pill` is NOT used:**
- Main section pages (`racing.astro`, `workshop.astro`, `code.astro`, `journal.astro`)
- Sub-section pages (`racing/reports.astro`, `code/posts.astro`)
- Racing-related pages (`calendar.astro`, `maintenance.astro`)
- Utility pages (`contact.astro`, `links.astro`)
- Admin pages (`admin/login.astro`, `admin/maintenance.astro`)

### Navigation Active States
The main navigation highlights the current page/section with a racing green filled pill. Path matching handles trailing slashes for production compatibility:

```javascript
// Normalize path (production uses trailing slashes, local dev does not)
const currentPath = Astro.url.pathname.replace(/\/$/, '') || '/';

// Exact match for single pages
<a href="/about" class={currentPath === '/about' ? 'active' : ''}>About</a>

// Prefix match for sections with nested routes
<a href="/racing" class={currentPath.startsWith('/racing') ? 'active' : ''}>Racing</a>
```

### Brand Accent Consistency
The racing green (`--accent-racing`) is used consistently for the "Staub" brand across:
- Header logo: `.brand-primary` class
- Footer brand: `.brand-accent` within `.footer-brand`
- Homepage hero: `.brand-accent` class
- Active nav pill: `.site-nav a.active`

### Layouts
- `src/layouts/Layout.astro` — Shared page shell with embedded navigation and footer (no separate Nav/Footer components)

### Key Components
- `ThemeToggle.astro` — Dark/light mode switching with localStorage persistence
- `MediaDisplay.astro` — Renders images, videos, and embedded content for blog posts
- `SubNav.astro` — Section-specific navigation with category links
- `SocialIcons.astro` — Social media links with two variants: `compact` (small icons) and `cards` (contact page style). Uses platform-specific accent colors with glow effects.
- `ui/BikeCard.astro` — Bike specs display with status indicators
- `ui/MaintenanceList.astro` — Renders maintenance tasks from Lambda API

**Note:** Blog posts and links are rendered inline in page templates rather than using card components. Navigation is embedded directly in Layout.astro.

### Component Patterns

**Variant Props** — Components like `SocialIcons.astro` support multiple rendering modes via a `variant` prop:
```astro
<SocialIcons variant="cards" />   <!-- Contact page: full cards with icons -->
<SocialIcons variant="compact" /> <!-- Footer: small icon buttons -->
```
This pattern keeps shared data (links, icons) in one place while allowing different visual presentations.

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

## Migration Complete

The site was migrated from a two-site setup (static HTML + blog subdomain) to a unified Astro codebase. All phases completed:

- **Phase 1**: Foundation — Layout components, routing structure, design system ✅
- **Phase 2**: Content migration — Blog posts, bike data, gallery images, links ✅
- **Phase 3**: Home page & polish — Hero, stats, dark/light toggle, responsiveness ✅
- **Phase 4**: AWS deployment — S3 sync, CloudFront config, GitHub Actions ✅
- **Phase 5**: Content cadence — Weekly publishing habit (ongoing)

See `docs/MIGRATION_PLAN.md` for historical reference.

## Claude Code Extensions

Custom skills and agents for this project:

**Skills** (invoked with `/skill-name`):
- `new-post` — Scaffold a new blog post with proper frontmatter and image folder
- `add-maintenance` — Add a maintenance task to the tracker

**Agents**:
- `content-reviewer` — Validates blog posts for quality and consistency

## Documentation

| File | Purpose |
|------|---------|
| `docs/MIGRATION_PLAN.md` | Consolidation roadmap and phases |
| `docs/THEME_GUIDE.md` | How to update colors and theme variables |
| `docs/IMAGE_GUIDE.md` | Adding images to blog posts |
| `docs/BLOG_IDEAS.md` | Content ideas and post tracking |
| `docs/DATABASE_INTEGRATION.md` | Maintenance quick-capture system (Lambda API + PostgreSQL) |

## Future Improvements

### Typography Cleanup
Individual page components (racing.astro, workshop.astro, journal.astro, code.astro) have scoped font styles that duplicate the global typography variables in theme.css. Consider removing redundant scoped styles once the global system is proven stable.

**Affected files:**
- `src/pages/racing.astro` — `.section-header h1` font-size, letter-spacing
- `src/pages/workshop.astro` — `.section-header h1`, `.post-card h2` font-size
- `src/pages/journal.astro` — `.section-header h1`, `.post-card h2` font-size
- `src/pages/code.astro` — similar patterns

**Global variables available:**
- `--font-size-h1`, `--font-size-h2`, `--font-size-h3`, `--font-size-h4`
- `--letter-spacing-heading`
