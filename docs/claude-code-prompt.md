# Claude Code Prompt — Staub Racing Site Migration

## Context

I'm consolidating my two websites into one Astro site:
- `staubracing.com` (static HTML — racing-focused main site)
- `blog.staubracing.com` (Astro blog — already deployed to S3 under /blog)

The blog repo IS the starting point. We're reshaping it into the combined site. The migration plan is in the repo — read it first.

## What to Build — Phase 1: Foundation

### Navigation System

**Main Nav** (persistent across all pages):
Home | Racing | Projects | Code | Life | Contact

**Sub-Nav** (appears contextually under each section):
- **Racing:** Bikes | Race Results | Gallery | Race Journal
- **Projects:** All Projects | Homelab | Automation | Hardware
- **Code:** All Posts | MotoAppPro | Tutorials | Dev Tools
- **Life:** All Stories | Aviation | Personal | Adventures

The sub-nav should be visually distinct from the main nav — it lives BELOW the main nav and only appears when you're inside a section. It should be clear it's contextual navigation within a section, not a competing menu.

### Design System

**Color:**
- Primary accent: `#2ecc71` (green — matches my logo)
- Dark background: `#0a0f14`
- Card background: `#111920`
- Nav background: `rgba(15, 22, 30, 0.85)` with backdrop blur
- Text primary: `#e8edf2`
- Text secondary: `#7a8a9e`
- Accent dim: `rgba(46, 204, 113, 0.15)`
- Border accent: `rgba(46, 204, 113, 0.2)`

**Typography:** Monospace font family (`'Courier New', 'Consolas', monospace`)

**Branding:**
- "STAUB" in green, "RACING" in primary text color
- Wide letter-spacing on headings (uppercase)
- EST 2020 · CRA #106

**Features:**
- Dark/light mode toggle (persist preference)
- Cards with green gradient top border
- Status indicators (green for active/ready, orange for in-progress)
- Numbered sections (01, 02, 03 pattern from current main site)

### Page Structure

```
src/pages/
├── index.astro              → Home (hero + stats + recent posts feed)
├── racing.astro             → Racing section landing
├── projects.astro           → Projects section landing
├── code.astro               → Code section landing
├── life.astro               → Life section landing
├── contact.astro            → Contact / social links
├── links.astro              → Resource links (convert from current JS-parsed markdown to static)
└── blog/
    └── [...slug].astro      → Individual blog posts
```

### Component Structure

```
src/components/
├── Nav.astro                → Main navigation bar
├── SubNav.astro             → Contextual sub-navigation
├── Footer.astro             → Site footer
├── BikeCard.astro           → Bike specs display (KX450F, ZX6R)
├── BlogPostCard.astro       → Blog post preview card
├── StatCard.astro           → Quick stat display (next race, focus, championship)
└── LinkCard.astro           → Resource link card
```

### Home Page Layout

1. **Hero:** Big "STAUB RACING" with tagline "Bikes, Builds & Bytes" — EST 2020 · CRA #106
2. **Stats Row:** Three cards — Next Race, Current Focus, Championship Standing
3. **Recent Pit Notes:** Feed of latest blog posts from ALL categories, each with colored left border by category, showing title, category tag, and date

### Key Voice/Copy

- Tagline: "Bikes, Builds & Bytes"
- Footer: "No bullshit. Just bikes, builds, and bytes."
- Subtitle: "Engineer. Racer. Developer."
- Tone: Direct, casual, no corporate speak

### What NOT to Change (Yet)

- Don't touch existing blog post markdown files — they carry over as-is
- Don't change the content collection setup
- Don't modify the GitHub Actions deploy workflow
- Keep the existing dark/light toggle logic, just restyle it

### Reference

The visual target is a React mockup I have — the design should match that aesthetic: dark theme, green accents, monospace type, card-based layout, clean and minimal with a racing identity feel. Think cinematic hero from the main site combined with the organizational structure of the blog.

## Build Approach

1. Read the migration plan in the repo first
2. Start with the layout components (BaseLayout, Nav, SubNav, Footer)
3. Build the home page
4. Create section landing pages
5. Verify existing blog posts still render correctly
6. Test navigation flow between all pages
