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

### Want to change your brand colors?

**Edit `src/styles/theme.css`**

```css
/* Dark Mode */
:root {
  --accent-racing: #1a8754; /* Your racing green */
  --accent-electric: #38bdf8; /* Your electric blue */
}

/* Light Mode */
:root[data-theme="light"] {
  --accent-racing: #15803d; /* Adjusted for light mode */
  --accent-electric: #0369a1; /* Adjusted for light mode */
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

**Questions?** Check the comments in each file for detailed explanations!
