# Claude Code Prompt — Sub-Navigation System

## Task

Add contextual sub-navigation to section pages. When a user clicks into Racing, Projects, Code, or Life from the main nav, a secondary nav bar should appear below the main nav showing that section's sub-pages.

## Sub-Nav Structure

**Racing:** Bikes | Race Results | Gallery | Race Journal
**Projects:** All Projects | Homelab | Automation | Hardware
**Code:** All Posts | MotoAppPro | Tutorials | Dev Tools
**Life:** All Stories | Aviation | Personal | Adventures

## Implementation

### 1. Create `SubNav.astro` component

- Accepts the current section name as a prop
- Renders the sub-nav items for that section
- Visually sits below the main nav with a subtle separator
- Styled to be clearly "within" a section — not a competing menu
- Should match the existing design system: monospace type, green accent for active item, muted text for inactive items
- Background slightly different from main nav to create visual hierarchy (darker or more transparent)
- Active sub-nav item highlighted the same way main nav highlights active page

### 2. Create sub-pages for each section

For now these can be placeholder pages that show the section heading and a "coming soon" or empty state. The structure matters more than the content right now.

```
src/pages/
├── racing/
│   ├── index.astro          (redirects or is the main Racing page)
│   ├── bikes.astro
│   ├── results.astro
│   ├── gallery.astro
│   └── journal.astro
├── projects/
│   ├── index.astro
│   ├── homelab.astro
│   ├── automation.astro
│   └── hardware.astro
├── code/
│   ├── index.astro
│   ├── motoapp.astro
│   ├── tutorials.astro
│   └── devtools.astro
└── life/
    ├── index.astro
    ├── aviation.astro
    ├── personal.astro
    └── adventures.astro
```

### 3. Include SubNav in section pages

Each section page and its sub-pages should include the SubNav component with the correct section prop. The main nav should highlight the parent section (e.g., "Racing" stays highlighted when you're on `/racing/bikes/`).

### 4. Move existing content to sub-pages where it makes sense

- Bike specs (KX450F, ZX6R cards) currently on `/racing/` → move to `/racing/bikes/`
- The racing index page becomes a section landing with overview and links to sub-pages
- Blog posts for each category should be accessible from the relevant section's sub-nav

## Design Details

- Sub-nav should have a label on the left showing the current section name (e.g., "RACING" in muted text) followed by the sub-nav items
- Sub-nav items should be smaller than main nav items
- Add a subtle bottom border or background shift to separate from main nav
- On mobile, sub-nav should scroll horizontally if needed
- Sub-nav should NOT appear on Home, About, Contact, or Links pages — only on section pages

## Example Visual Layout

```
┌──────────────────────────────────────────────────────────┐
│  STAUB RACING    Home  About  Racing  Projects  Code ... │  ← main nav
├──────────────────────────────────────────────────────────┤
│  RACING    Bikes   Race Results   Gallery   Race Journal │  ← sub-nav (only on section pages)
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    Page Content                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## What NOT to Change

- Don't modify the main Nav.astro component's structure (just ensure it highlights parent sections correctly)
- Don't change existing blog post files
- Don't change the deploy workflow
- Keep all existing pages working at their current URLs
