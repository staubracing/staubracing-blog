# Creating Blog Posts

How to create new blog posts with proper frontmatter, folder structure, and images.

## Quick Start

Use the `/new-post` skill to scaffold a post automatically:

```
/new-post
```

This creates:
- A new `.md` file in the correct category folder
- Proper frontmatter with all required fields
- An image directory for post images

## Manual Creation

### 1. Create the File

Create a new `.md` file in the appropriate category folder:

```
src/content/blog/
├── racing/     # Race reports, bike updates, track days
├── code/       # Tutorials, dev logs, project updates
├── projects/   # DIY builds, hardware, tools
└── life/       # Personal stories, reflections, career
```

### 2. Add Frontmatter

Every post must include these frontmatter fields:

```yaml
---
title: "Your Post Title"
date: 2026-02-22
tags: ["tag1", "tag2"]
category: racing
draft: false
---
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title (use quotes if it contains colons) |
| `date` | date | Publication date (YYYY-MM-DD) |
| `tags` | array | Array of tag strings |
| `category` | string | One of: `racing`, `code`, `projects`, `life` |
| `draft` | boolean | `true` excludes from production builds |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `series` | string | Groups multi-part posts (e.g., "ZX6R Rebuild") |
| `editor` | string | Editor credit |
| `featured` | boolean | Highlight on homepage (default: `false`) |

### 3. Create Image Folder

```bash
mkdir -p public/images/blog/{category}/{post-slug}
```

Example:
```bash
mkdir -p public/images/blog/racing/2026-season-opener
```

## Categories

Categories are configured in `src/content/categories.json`:

| Category | Description | Emoji |
|----------|-------------|-------|
| `racing` | Race reports, track days, bike work | 🏁 |
| `code` | Programming, tutorials, dev logs | 💻 |
| `projects` | DIY builds, hardware, making | 🔧 |
| `life` | Personal stories, reflections | 📝 |

## Draft Posts

Set `draft: true` to exclude a post from production:

```yaml
---
title: "Work in Progress"
date: 2026-02-22
tags: ["draft"]
category: code
draft: true
---
```

Draft posts are visible during development (`yarn dev`) but won't appear in production builds.

## Series Posts

For multi-part content, use the `series` field:

```yaml
---
title: "ZX6R Engine Rebuild Part 1"
series: "ZX6R Rebuild"
---
```

Posts in the same series are grouped together and can be navigated sequentially.

## Example: Complete Post

```markdown
---
title: "2026 Season Opener at Blackhawk Farms"
date: 2026-03-15
tags: ["race-report", "cra", "zx6r"]
category: racing
draft: false
featured: true
---

The season kicked off with perfect weather and a fully prepped ZX6R.

## Practice Sessions

Morning practice went smoothly. The suspension changes from last
season made a huge difference in turn 1.

![Bike on grid](/images/blog/racing/2026-season-opener/grid.jpg)

## Race Results

Finished P3 in Formula 40, improving my lap times by 1.2 seconds
from last year.

| Session | Time | Position |
|---------|------|----------|
| Practice | 1:18.4 | P5 |
| Qualifying | 1:17.2 | P3 |
| Race | 1:16.8 | P3 |

## Next Steps

The bike is running great. Focus for next round:
- [ ] Fine-tune rear suspension
- [ ] Review tire wear patterns
- [ ] Work on T5 entry speed
```

## Workflow

1. **Create** post using `/new-post` skill or manually
2. **Write** content in Markdown
3. **Add images** to the post's image folder
4. **Preview** with `yarn dev`
5. **Build** with `yarn build` to verify
6. **Deploy** by pushing to `main` (automatic via GitHub Actions)
