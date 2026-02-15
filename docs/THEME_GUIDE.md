# Theme System Guide

## 📁 Modular Structure

Your theme is now organized into separate, maintainable files:

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

## 🎨 How to Update Colors

### Accent Color Usage

| Color | Variable | Use Case |
| ----- | -------- | -------- |
| Racing Green | `--accent-racing` | Primary brand elements, hero sections, main accents |
| Kawasaki Lime | `--accent-lime` | Subtle pops, highlights, status badges, hover glows |
| Electric Blue | `--accent-electric` | Links, interactive highlights, secondary accents |
| Amber | `--accent-amber` | Warnings, attention states |

**Design principle:** Racing green is the foundation, lime adds pops, blue handles interactivity.

### Want to change your brand colors?

**Edit `src/styles/theme.css`**

```css
/* Dark Mode */
:root {
  --accent-racing: #1a8754; /* Racing green - brand primary */
  --accent-lime: #66BB6A; /* Kawasaki lime - subtle pops */
  --accent-electric: #38bdf8; /* Electric blue - links, highlights */
}

/* Light Mode */
:root[data-theme="light"] {
  --accent-racing: #15803d; /* Racing green - adjusted for contrast */
  --accent-lime: #4CAF50; /* Kawasaki lime - adjusted for contrast */
  --accent-electric: #0369a1; /* Electric blue - adjusted for contrast */
}
```

### Want to adjust text contrast?

**Edit `src/styles/theme.css`**

```css
:root[data-theme="light"] {
  --text-primary: #0f172a; /* Main text */
  --text-secondary: #1e293b; /* Body text, descriptions */
}
```

### Want to change layout spacing?

**Edit `src/styles/theme.css`**

```css
:root {
  --radius-lg: 28px; /* Large border radius */
  --radius-md: 18px; /* Medium border radius */
  --layout-max: 1200px; /* Max content width */
}
```

## 🔧 How to Add Global Styles

**Edit `src/styles/global.css`**

Add styles that should apply across your entire site:

```css
/* Example: Add a new utility class */
.highlight-box {
  background: var(--accent-electric);
  color: var(--text-primary);
  padding: 1rem;
  border-radius: var(--radius-md);
}
```

## 📝 TypeScript Theme Config

**`src/config/theme.ts`** provides:

- Theme type definitions
- Programmatic access to theme values
- Helper functions for theme management

Use it in your Astro components:

```typescript
import { themeConfig, getPreferredTheme } from "../config/theme";

// Access theme values
const primaryColor = themeConfig.colors.dark.primary;
```

## ✅ Benefits of This Structure

1. **Single Source of Truth**

   - Change a color in one place, updates everywhere

2. **Easy Maintenance**

   - No hunting through files for hardcoded colors
   - Clear separation of concerns

3. **Similar to React Native**

   - Same organizational pattern as your APV project
   - Familiar structure for future updates

4. **Better Performance**

   - CSS files cached by browser
   - Smaller HTML output

5. **Team-Friendly**
   - Clear where to make changes
   - Well-documented structure

## 🚀 Quick Reference

| Task                    | File to Edit                       |
| ----------------------- | ---------------------------------- |
| Change colors           | `src/styles/theme.css`             |
| Add global styles       | `src/styles/global.css`            |
| Modify toggle UI        | `src/components/ThemeToggle.astro` |
| Update layout structure | `src/layouts/Layout.astro`         |
| Theme logic/config      | `src/config/theme.ts`              |

## 💡 Tips

- Use CSS variables everywhere: `color: var(--accent-racing)`
- Never hardcode colors in components
- Test both light and dark modes after changes
- Run `yarn build` to verify no errors

---

**Questions?** Check the comments in `src/styles/theme.css` for detailed variable explanations.
