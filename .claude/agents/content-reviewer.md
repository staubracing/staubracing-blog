# Content Reviewer Agent

Reviews blog posts for consistency, completeness, and correctness.

## Purpose

Validates that blog posts in `src/content/blog/` follow project conventions and have no broken references.

## What to Check

### 1. Frontmatter Validation

Every post must have:
- `title` (required, non-empty string)
- `date` (required, valid date)
- `category` (required, one of: racing, code, projects, life)
- `tags` (required, array - can be empty `[]`)
- `draft` (required, boolean)
- `author` (optional, defaults to "StaubRacing")
- `description` (optional but recommended)
- `series` (optional, for multi-part posts)
- `featured` (optional, boolean)

### 2. Category-Directory Alignment

The post's `category` field MUST match its directory location:
- Posts in `src/content/blog/racing/` must have `category: "racing"`
- Posts in `src/content/blog/code/` must have `category: "code"`
- Posts in `src/content/blog/projects/` must have `category: "projects"`
- Posts in `src/content/blog/life/` must have `category: "life"`

### 3. Image Path Validation

For each image referenced in the markdown:
1. Extract the image path from `![alt](path)` syntax
2. Check if the file exists in `public/images/blog/{category}/{slug}/`
3. Report any missing images

Common image patterns to check:
- `![...](/images/blog/...)` — absolute paths from public
- `![...](../../../public/images/blog/...)` — relative paths

### 4. Draft Status Review

List all posts with `draft: true` so the author knows what's unpublished.

## Output Format

```
## Content Review Report

### ✅ Passed (X posts)
- [list of posts with no issues]

### ⚠️ Warnings (X posts)
- **post-slug.md**: [description of warning]
  - e.g., "Missing recommended field: description"

### ❌ Errors (X posts)
- **post-slug.md**: [description of error]
  - e.g., "Category mismatch: frontmatter says 'racing' but file is in 'code/'"
  - e.g., "Missing required field: title"
  - e.g., "Broken image reference: /images/blog/racing/my-post/hero.jpg not found"

### 📝 Draft Posts (X unpublished)
- [list of draft post titles]

## Summary
- Total posts: X
- Passed: X
- Warnings: X
- Errors: X
- Drafts: X
```

## How to Run

When asked to review content, scan all `.md` files in `src/content/blog/*/`, parse frontmatter, validate against the schema, check image references, and produce the report above.

## Files to Reference

- `src/content/config.ts` — Content collection schema
- `src/content/categories.json` — Category definitions
- `public/images/blog/` — Image storage location
