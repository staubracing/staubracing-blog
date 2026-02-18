# Staub Racing — Astro Migration Plan

## Overview

Consolidate `staubracing.com` (static HTML) and `blog.staubracing.com` (Astro/GitHub Pages) into a single Astro site deployed to AWS S3 + CloudFront.

**End state:** One repo, one build, one deployment — all content living under `staubracing.com`.

---

## Current Status (Updated 2026-02-18)

| Phase | Status | Completion |
|-------|--------|------------|
| 1: Foundation | ✅ Complete | 100% |
| 2: Content Migration | ✅ Complete | 100% |
| 3: Home Page & Polish | ✅ Complete | 100% |
| 4: AWS Deployment | ✅ Complete | 100% |
| 5: Content Cadence | ✅ Complete | 100% |

**Migration complete.** Ongoing content planning now tracked in `docs/BLOG_IDEAS.md`.

---

## Phase 1: Foundation ✅

**Goal:** Get a working Astro project with the new site structure and design system.

- [x] Clone the existing Astro blog repo as the starting point
- [x] Define the design system: green accent color, dark/light toggle, monospace typography, card patterns
- [x] Build core layout components:
  - [x] `Layout.astro` — shared page shell (head, meta, fonts, nav, footer combined)
  - [x] `ThemeToggle.astro` — dark/light mode with localStorage persistence
  - [ ] `SubNav.astro` — contextual sub-navigation per section (optional, later)
- [x] Build reusable UI components:
  - [x] `BikeCard.astro` — bike specs with status indicators
  - [x] `StatCard.astro` — key-value stat display
  - [x] `MediaDisplay.astro` — images, videos, embeds
- [x] Set up the page routing structure:
  - [x] `src/pages/index.astro` — Home
  - [x] `src/pages/racing.astro` — Racing section (with bike cards + stats)
  - [x] `src/pages/projects.astro` — Projects section
  - [x] `src/pages/code.astro` — Code section
  - [x] `src/pages/life.astro` — Life section
  - [x] `src/pages/contact.astro` — Contact page with social links
  - [x] `src/pages/links.astro` — Links hub
  - [x] `src/pages/blog/[...slug].astro` — dynamic blog post pages
  - [x] `src/pages/category/[category].astro` — category listings (backwards compatible)

**Milestone:** ✅ Site builds locally with all pages navigable and styled.

---

## Phase 2: Content Migration ✅

**Goal:** Move all existing content into the Astro project.

### From the main site (`staubracing.com`)
- [x] Bike specs and status → `src/data/bikes.json` (KX450F, ZX6R)
- [x] Gallery images → `public/images/gallery/` (20+ racing photos)
- [x] Race results and championship standing → racing page stats row
- [x] Hero copy and branding → home page (EST 2020, CRA #106)
- [x] Favicons → `public/`

### From the blog (`blog.staubracing.com`)
- [x] Existing markdown posts in `src/content/blog/`
- [x] All 5 posts render correctly:
  - [x] ZX6R Engine Rebuild Part 1 (Racing)
  - [x] ZX6R Engine Rebuild Part 2 (Racing)
  - [x] Raspberry Pi Home Server (Projects)
  - [x] Learning TypeScript in 2025 (Code)
  - [x] Who Pulled the Breaker? (Life)
- [x] Category filtering works on section pages
- [x] Tag system carries over

### From the links page
- [x] Created `src/data/links.json` with categorized links
- [x] Built `src/pages/links.astro` — static, no client-side fetch

**Milestone:** ✅ All existing content is visible and browsable.

---

## Phase 3: Home Page & Polish ✅

**Goal:** Build the combined home page and refine the user experience.

- [x] Home page hero with STAUB RACING branding
- [x] EST 2020 · CRA #106 badge
- [x] "Recent Pit Notes" feed pulling latest posts from all categories
- [x] Categories grid with post counts
- [x] Dark/light mode toggle with localStorage persistence
- [x] Flash prevention inline script
- [x] Mobile responsiveness — nav collapse, card stacking, hero scaling
- [x] Meta tags and Open Graph data for social sharing
- [x] Twitter card meta tags
- [x] Favicon and branding assets

**Milestone:** ✅ Site looks and feels complete. Ready for real users.

---

## Phase 4: AWS Deployment ✅

**Goal:** Deploy to S3 + CloudFront, retire GitHub Pages.

- [x] `astro build` produces clean output in `dist/`
- [x] GitHub Actions workflow configured:
  - [x] Trigger: push to `main`
  - [x] Steps: checkout → install → `astro build` → `aws s3 sync` → CloudFront invalidation
  - [x] Syncs to `s3://staubracing.com` (root, not `/blog` subpath)
  - [x] Invalidates `/*` paths on CloudFront
- [x] AWS credentials stored as GitHub Secrets

**Milestone:** ✅ Push to main auto-deploys to AWS.

---

## Phase 5: Content Cadence ✅

**Goal:** Establish the weekly publishing habit.

- [x] Blog post workflow: write `.md` file → `git add` → `git push` → auto-deploys
- [x] Ideas list and publishing cadence moved to `docs/BLOG_IDEAS.md`

**Note:** Phase 5 described an operational workflow, not a build task. Content planning is now tracked separately in BLOG_IDEAS.md as ongoing work.

---

## Migration Complete 🎉

All infrastructure phases are finished. The site is:

- **Live** at `staubracing.com` via AWS S3 + CloudFront
- **Automated** with GitHub Actions CI/CD
- **Ready** for ongoing content creation

For future content planning, see `docs/BLOG_IDEAS.md`.

---

## Future Improvements (Optional)

| Item | Priority | Notes |
|------|----------|-------|
| SubNav component | Low | Contextual nav per section (see `claude-code-prompt.md`) |
| Image optimization | Medium | Use Astro's `<Image />` for auto-sizing/format |
| Blog post Part 2 | Medium | ZX6R Engine Rebuild Part 2 needs content |
| Navigation restructure | Medium | User has ideas for later |

---

## Tech Stack Summary

| Layer | Tool |
|-------|------|
| Framework | Astro 5 |
| Content | Markdown/MDX with frontmatter |
| Styling | CSS with custom properties (`src/styles/theme.css`) |
| Hosting | AWS S3 (static files) |
| CDN | AWS CloudFront |
| DNS | AWS Route 53 |
| SSL | AWS Certificate Manager |
| CI/CD | GitHub Actions |
| Repo | Single GitHub repository |
