# StaubRacing Blog

A personal blog built with Astro, featuring content about racing, coding, projects, and life.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Deploy to GitHub Pages
yarn deploy
```

## 📁 Project Structure

- `src/pages/` - Astro page routes
- `src/layouts/` - Shared layout components
- `src/components/` - Reusable UI components
- `src/content/blog/` - Blog posts organized by category
- `public/images/blog/` - Blog post images
- `scripts/` - Utility scripts (e.g., image helpers)
- `docs/` - Documentation and guides

## 📝 Adding Blog Posts

1. Create a new markdown file in `src/content/blog/{category}/{slug}.md`
2. Add frontmatter with `title`, `date`, `tags`, `category`, etc.
3. Use the image helper script: `node scripts/add-images.js generate-html {category}/{slug}`

See `docs/IMAGE_GUIDE.md` for detailed image usage instructions.

## 🛠️ Tech Stack

- **Astro** - Static site generator
- **MDX** - Markdown with JSX support
- **TypeScript** - Type safety
- **GitHub Pages** - Hosting

## 📚 Documentation

- `docs/IMAGE_GUIDE.md` - How to add images to posts
- `docs/THEME_GUIDE.md` - Theme customization
- `AGENTS.md` - Repository guidelines and conventions
