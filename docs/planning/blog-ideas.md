# Blog Ideas

Content planning and publishing cadence for staubracing.com.

## Publishing Cadence

**Current goal:** Biweekly posts for 8 weeks, then weekly.

**Category rotation:**
1. **Racing** — race reports, bike updates, track day recaps
2. **Code/Projects** — tutorials, project updates, dev logs
3. **Life** — stories, reflections, career
4. **Wild card** — anything that fits

**Quick start:** Use the `/new-post` skill to scaffold a new post with proper frontmatter and image folder.

---

## Ideas by Category

### Racing

-

### Life

- **Road trip the day I had a Primus concert**
- **Write out a few Kevin stories, airstair ride, and ones from the text messages**
- **Story about the girl dumping the lav and getting blue juice all over the bed**

### Code

- **Working on the APV project and dealing with my first code review**

### Projects

- **Building a raspberry pi home server**
- **Spending categorizer and realizing I did not use AI to help me**
- **Building a raspberry pi home server**

---

## Archive (Completed)

<!-- Move completed blog posts here for reference -->

---

## Future Improvements

Ideas that don't fit in CLAUDE.md but are worth tracking:

### Calendar Auto-Rebuild
The race calendar currently uses static mock data. Once Google Calendar API is integrated, events will be fetched at build time. To keep the calendar fresh without manual rebuilds:

**Add scheduled GitHub Actions workflow** (weekly rebuild):
```yaml
# .github/workflows/scheduled-build.yml
name: Weekly Calendar Refresh
on:
  schedule:
    - cron: '0 6 * * 1'  # Monday 6am UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  build-and-deploy:
    uses: ./.github/workflows/deploy.yml
```

This ensures calendar events stay current without requiring a git push for every schedule change.

### Typography Cleanup
Individual page components (racing.astro, workshop.astro, journal.astro, code.astro) have scoped font styles that duplicate the global typography variables in theme.css. Consider removing redundant scoped styles once the global system is proven stable.

**Affected files:**
- `src/pages/racing.astro` — `.section-header h1` font-size, letter-spacing
- `src/pages/workshop.astro` — `.section-header h1`, `.post-card h2` font-size
- `src/pages/journal.astro` — `.section-header h1`, `.post-card h2` font-size
- `src/pages/code.astro` — similar patterns

**Global variables available:**
- `--font-size-h1`, `--font-size-h2`, `--font-size-h3`, `--font-size-h4`
- `--letter-spacing-heading`
