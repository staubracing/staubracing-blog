# Theme Customization Guide

How to update colors, spacing, and visual styling for staubracing.com.

## File Locations

```
src/
├── styles/
│   ├── theme.css       # All color variables & theme tokens
│   └── global.css      # Base styles & reusable components
├── config/
│   └── theme.ts        # Theme constants & utilities
├── components/
│   └── ThemeToggle.astro  # Toggle switch component
└── layouts/
    └── Layout.astro    # Layout-specific styles only
```

## Changing Colors

### Accent Color Palette

| Color | Variable | Use Case |
| ----- | -------- | -------- |
| Racing Green | `--accent-racing` | Primary brand elements, hero sections, main accents |
| Kawasaki Lime | `--accent-lime` | Subtle pops, highlights, status badges, hover glows |
| Electric Blue | `--accent-electric` | Links, interactive highlights, secondary accents |
| Amber | `--accent-amber` | Warnings, attention states |

**Design principle:** Racing green is the foundation, lime adds pops, blue handles interactivity.

### Edit `src/styles/theme.css`

```css
/* Dark Mode (default) */
:root {
  --accent-racing: #1a8754; /* Racing green - brand primary */
  --accent-lime: #66BB6A;   /* Kawasaki lime - subtle pops */
  --accent-electric: #38bdf8; /* Electric blue - links, highlights */
}

/* Light Mode */
:root[data-theme="light"] {
  --accent-racing: #15803d; /* Adjusted for contrast */
  --accent-lime: #4CAF50;
  --accent-electric: #0369a1;
}
```

## Where Racing Green is Used

| Element | Location | CSS Class |
| ------- | -------- | --------- |
| Header logo "Staub" | `Layout.astro` | `.brand-primary` |
| Footer brand "Staub" | `Layout.astro` | `.footer-brand .brand-accent` |
| Homepage hero "Staub" | `index.astro` | `.brand-accent` |
| Active nav pill | `Layout.astro` | `.site-nav a.active` |
| Category pills | Various | `.category-pill` variants |

## Adjusting Text Contrast

Edit `src/styles/theme.css`:

```css
:root[data-theme="light"] {
  --text-primary: #0f172a;   /* Main text */
  --text-secondary: #1e293b; /* Body text, descriptions */
}
```

## Changing Layout Spacing

Edit `src/styles/theme.css`:

```css
:root {
  --radius-lg: 28px;     /* Large border radius */
  --radius-md: 18px;     /* Medium border radius */
  --layout-max: 1200px;  /* Max content width */
}
```

## Adding Global Styles

Edit `src/styles/global.css`:

```css
/* Example: Add a new utility class */
.highlight-box {
  background: var(--accent-electric);
  color: var(--text-primary);
  padding: 1rem;
  border-radius: var(--radius-md);
}
```

## TypeScript Theme Config

`src/config/theme.ts` provides:
- Theme type definitions
- Programmatic access to theme values
- Helper functions for theme management

```typescript
import { themeConfig, getPreferredTheme } from "../config/theme";

// Access theme values
const primaryColor = themeConfig.colors.dark.primary;
```

## Quick Reference

| Task | File to Edit |
| ---- | ------------ |
| Change colors | `src/styles/theme.css` |
| Add global styles | `src/styles/global.css` |
| Modify toggle UI | `src/components/ThemeToggle.astro` |
| Update layout structure | `src/layouts/Layout.astro` |
| Theme logic/config | `src/config/theme.ts` |

## Tips

- Use CSS variables everywhere: `color: var(--accent-racing)`
- Never hardcode colors in components
- Test both light and dark modes after changes
- Run `yarn build` to verify no errors
