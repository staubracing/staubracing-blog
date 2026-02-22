# Migration History

Historical record of the site migration from a two-site setup to unified Astro codebase.

> **Status:** Complete. This document is archived for reference.

## Overview

Consolidated `staubracing.com` (static HTML) and `blog.staubracing.com` (Astro/GitHub Pages) into a single Astro site deployed to AWS S3 + CloudFront.

**End state:** One repo, one build, one deployment — all content living under `staubracing.com`.

---

## Timeline

| Date | Milestone |
|------|-----------|
| 2026-01 | Phase 1: Foundation complete |
| 2026-01 | Phase 2: Content migration complete |
| 2026-02 | Phase 3: Home page & polish complete |
| 2026-02 | Phase 4: AWS deployment complete |
| 2026-02 | Phase 5: Content cadence established |
| 2026-02-18 | Migration declared complete |

---

## Phase 1: Foundation ✅

**Goal:** Get a working Astro project with the new site structure and design system.

**Completed:**
- [x] Clone the existing Astro blog repo as the starting point
- [x] Define the design system: green accent color, dark/light toggle, monospace typography, card patterns
- [x] Build core layout components:
  - [x] `Layout.astro` — shared page shell (head, meta, fonts, nav, footer combined)
  - [x] `ThemeToggle.astro` — dark/light mode with localStorage persistence
- [x] Build reusable UI components:
  - [x] `BikeCard.astro` — bike specs with status indicators
  - [x] `StatCard.astro` — key-value stat display
  - [x] `MediaDisplay.astro` — images, videos, embeds
- [x] Set up the page routing structure

**Milestone:** Site builds locally with all pages navigable and styled.

---

## Phase 2: Content Migration ✅

**Goal:** Move all existing content into the Astro project.

**From the main site (`staubracing.com`):**
- [x] Bike specs and status → `src/data/bikes.json` (KX450F, ZX6R)
- [x] Gallery images → `public/images/gallery/` (20+ racing photos)
- [x] Race results and championship standing → racing page stats row
- [x] Hero copy and branding → home page (EST 2020, CRA #106)
- [x] Favicons → `public/`

**From the blog (`blog.staubracing.com`):**
- [x] Existing markdown posts in `src/content/blog/`
- [x] All posts render correctly with category filtering
- [x] Tag system carries over

**From the links page:**
- [x] Created `src/data/links.json` with categorized links
- [x] Built `src/pages/links.astro`

**Milestone:** All existing content is visible and browsable.

---

## Phase 3: Home Page & Polish ✅

**Goal:** Build the combined home page and refine the user experience.

**Completed:**
- [x] Home page hero with STAUB RACING branding
- [x] EST 2020 · CRA #106 badge
- [x] "Recent Pit Notes" feed pulling latest posts from all categories
- [x] Categories grid with post counts
- [x] Dark/light mode toggle with localStorage persistence
- [x] Flash prevention inline script
- [x] Mobile responsiveness — nav collapse, card stacking, hero scaling
- [x] Meta tags and Open Graph data for social sharing
- [x] Favicon and branding assets

**Milestone:** Site looks and feels complete. Ready for real users.

---

## Phase 4: AWS Deployment ✅

**Goal:** Deploy to S3 + CloudFront, retire GitHub Pages.

**Completed:**
- [x] `astro build` produces clean output in `dist/`
- [x] GitHub Actions workflow configured:
  - [x] Trigger: push to `main`
  - [x] Steps: checkout → install → `astro build` → `aws s3 sync` → CloudFront invalidation
  - [x] Syncs to `s3://staubracing.com` (root, not `/blog` subpath)
  - [x] Invalidates `/*` paths on CloudFront
- [x] AWS credentials stored as GitHub Secrets

**Milestone:** Push to main auto-deploys to AWS.

---

## Phase 5: Content Cadence ✅

**Goal:** Establish the weekly publishing habit.

**Completed:**
- [x] Blog post workflow: write `.md` file → `git add` → `git push` → auto-deploys
- [x] Ideas list and publishing cadence moved to `docs/planning/blog-ideas.md`

**Milestone:** Ongoing content creation workflow established.

---

## Lessons Learned

### What Worked Well
- Astro's content collections made migration straightforward
- Component-based theming enabled rapid iteration
- GitHub Actions deployment pipeline is reliable
- Single repo eliminated sync issues

### What Would Change
- Would have started with unified site from day one
- Could have used more automation for image migration
- Earlier investment in documentation would have helped

---

## Tech Stack Summary

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
| Repo | Single GitHub repository |

---

*This document is archived. For ongoing content planning, see `docs/planning/blog-ideas.md`.*
