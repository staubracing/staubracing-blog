# Content Schema Reference

Frontmatter fields and content collection configuration for blog posts.

## Schema Location

Content collection schema defined in: `src/content/config.ts`

Categories configured in: `src/content/categories.json`

## Blog Post Frontmatter

### Required Fields

| Field | Type | Example |
|-------|------|---------|
| `title` | string | `"ZX6R Engine Rebuild Part 1"` |
| `date` | date | `2026-02-22` |
| `tags` | array | `["racing", "zx6r", "engine"]` |
| `category` | string | `racing` |
| `draft` | boolean | `false` |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `series` | string | — | Groups multi-part posts |
| `editor` | string | — | Editor credit |
| `featured` | boolean | `false` | Highlight on homepage |

## Categories

Valid category values (defined in `categories.json`):

| Value | Label | Emoji | Description |
|-------|-------|-------|-------------|
| `racing` | Racing | 🏁 | Race reports, track days, bike work |
| `code` | Code | 💻 | Programming, tutorials, dev logs |
| `projects` | Projects | 🔧 | DIY builds, hardware, making |
| `life` | Life | 📝 | Personal stories, reflections |

## Example Frontmatter

### Minimal Post

```yaml
---
title: "My First Post"
date: 2026-02-22
tags: ["introduction"]
category: life
draft: false
---
```

### Full Featured Post

```yaml
---
title: "ZX6R Engine Rebuild Part 1: Teardown"
date: 2026-02-22
tags: ["racing", "zx6r", "engine", "rebuild"]
category: racing
draft: false
series: "ZX6R Rebuild"
editor: "Jane Doe"
featured: true
---
```

### Series Post

```yaml
---
title: "Learning TypeScript Part 2: Types"
date: 2026-03-01
tags: ["typescript", "learning"]
category: code
draft: false
series: "Learning TypeScript"
---
```

## Draft Behavior

Posts with `draft: true`:

- **Visible** during development (`yarn dev`)
- **Excluded** from production builds (`yarn build`)
- **Never deployed** to staubracing.com

Use drafts for work-in-progress content that isn't ready for publication.

## Content Location

Blog posts are stored in category-organized folders:

```
src/content/blog/
├── racing/
│   ├── zx6r-engine-rebuild-part1.md
│   └── zx6r-engine-rebuild-part2.md
├── code/
│   └── learning-typescript.md
├── projects/
│   └── raspberry-pi-home-server.md
└── life/
    └── who-pulled-the-breaker.md
```

## File Naming

- Use kebab-case: `my-post-title.md`
- Slug is derived from filename
- Series posts should have consistent naming: `series-name-part1.md`

## Querying Content

Content is queried via Astro's content collections:

```astro
---
import { getCollection } from 'astro:content';

// Get all published posts
const posts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});

// Filter by category
const racingPosts = posts.filter(post => post.data.category === 'racing');

// Sort by date
const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
```
