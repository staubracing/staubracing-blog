# Staub Racing — Astro Migration Plan

## Overview

Consolidate `staubracing.com` (static HTML) and `blog.staubracing.com` (Astro/GitHub Pages) into a single Astro site deployed to AWS S3 + CloudFront.

**End state:** One repo, one build, one deployment — all content living under `staubracing.com`.

---

## Phase 1: Foundation

**Goal:** Get a working Astro project with the new site structure and design system.

- Clone the existing Astro blog repo as the starting point
- Define the design system: green accent color, dark/light toggle, monospace typography, card patterns
- Build core layout components:
  - `BaseLayout.astro` — shared page shell (head, meta, fonts)
  - `Nav.astro` — main navigation (Home, Racing, Projects, Code, Life, Contact)
  - `SubNav.astro` — contextual sub-navigation per section
  - `Footer.astro`
- Build reusable UI components:
  - `BikeCard.astro`
  - `BlogPostCard.astro`
  - `StatCard.astro`
  - `LinkCard.astro`
- Set up the page routing structure:
  - `src/pages/index.astro` — Home
  - `src/pages/racing.astro`
  - `src/pages/projects.astro`
  - `src/pages/code.astro`
  - `src/pages/life.astro`
  - `src/pages/contact.astro`
  - `src/pages/links.astro`
  - `src/pages/blog/[...slug].astro` — dynamic blog post pages

**Milestone:** Site builds locally with all pages navigable and styled. No content yet — just structure.

---

## Phase 2: Content Migration

**Goal:** Move all existing content into the Astro project.

### From the main site (`staubracing.com`)
- Bike specs and status → racing page data (can be a simple JSON/YAML data file or frontmatter)
- Gallery images → `public/images/` directory
- Race results and championship standing → racing page
- Hero copy and branding → home page

### From the blog (`blog.staubracing.com`)
- Existing markdown posts move to `src/content/blog/` as-is (they should already have frontmatter with categories and tags)
- Verify all 5 posts render correctly:
  - ZX6R Engine Rebuild Part 1 & 2 (Racing)
  - Raspberry Pi Home Server (Projects)
  - Learning TypeScript (Code)
  - Who Pulled the Breaker? (Life)
- Category filtering works on section pages
- Tag system carries over

### From the links page
- Convert `links.md` into a content collection or data file
- Build `links.astro` page — static HTML, no client-side fetch/parse
- Organize links by site categories (or keep standalone, your call)

**Milestone:** All existing content is visible and browsable. Nothing lost from either site.

---

## Phase 3: Home Page & Polish

**Goal:** Build the combined home page and refine the user experience.

- Home page hero with STAUB RACING branding, EST 2020, CRA #106
- Quick stats panel (next race, current focus, championship standing)
- "Recent Pit Notes" feed pulling latest posts from all categories
- Dark/light mode toggle with persistence
- Mobile responsiveness — test nav collapse, card stacking, hero scaling
- Image optimization (Astro's built-in `<Image />` component for automatic sizing/format)
- Meta tags and Open Graph data for social sharing (important since this is your social link)
- Favicon and branding assets

**Milestone:** Site looks and feels like the mockup. Ready for real users.

---

## Phase 4: AWS Deployment

**Goal:** Deploy to S3 + CloudFront, retire GitHub Pages.

- Verify `astro build` produces clean output in `dist/`
- Sync `dist/` to the existing S3 bucket (or create a new one)
- Update CloudFront configuration:
  - Verify or add URL rewrite function (`/racing` → `/racing/index.html`)
  - Cache behaviors for static assets vs HTML
  - SSL cert still valid for `staubracing.com`
- Update Route 53 if any DNS changes needed
- Set up GitHub Actions workflow:
  - Trigger: push to `main`
  - Steps: checkout → install → `astro build` → `aws s3 sync` → CloudFront invalidation
  - AWS credentials stored as GitHub Secrets
- Redirect `blog.staubracing.com` → `staubracing.com/blog` (301 redirect)
- Retire the old GitHub Pages deployment

**Milestone:** Push to main auto-deploys to AWS. One command to publish.

---

## Phase 5: Content Cadence

**Goal:** Establish the weekly publishing habit.

- Start with biweekly posts for the first 8 weeks, then move to weekly
- Rotate across categories to keep the site balanced:
  - Week 1: Racing (race report, bike update, track day recap)
  - Week 2: Code or Projects (tutorial, project update, dev log)
  - Week 3: Life (story, reflection, career)
  - Week 4: Wild card
- Blog post workflow: write `.md` file → `git add` → `git push` → auto-deploys
- Keep a running ideas list so you're never staring at a blank page

---

## Decisions to Make Before Starting

| Decision | Options | Notes |
|----------|---------|-------|
| Color scheme | Green accent (current leaning) vs orange vs something new | Get feedback from your people |
| Hero style | Cinematic (main site) vs casual (blog) vs hybrid | The mockup used cinematic — confirm |
| Sub-nav items | What goes under each section? | Draft the full nav tree |
| Links page | Standalone page or integrated into sections? | Standalone is simpler to start |
| Domain for `chrisstaub` site | Redirect to staubracing? Kill it? Keep separate? | Low priority but worth deciding |

---

## Tech Stack Summary

| Layer | Tool |
|-------|------|
| Framework | Astro |
| Content | Markdown with frontmatter |
| Styling | CSS (scoped in components) |
| Hosting | AWS S3 (static files) |
| CDN | AWS CloudFront |
| DNS | AWS Route 53 |
| SSL | AWS Certificate Manager |
| CI/CD | GitHub Actions |
| Repo | Single GitHub repository |
