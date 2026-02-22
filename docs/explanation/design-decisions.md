# Design Decisions

Context and rationale behind technical choices for staubracing.com.

## Why Astro?

**Decision:** Use Astro 5 as the web framework.

**Rationale:**
- **Static generation** — Perfect for a content-focused site with infrequent updates
- **Content collections** — Built-in support for blog posts with schema validation
- **Zero JS by default** — Only ships JavaScript when needed (theme toggle)
- **Familiar syntax** — JSX-like components without React overhead
- **Performance** — No hydration, minimal bundle size

**Alternatives considered:**
- Next.js — Overkill for a static site, more complexity
- Plain HTML — Would lose content management benefits
- WordPress — Too heavy, security surface area, hosting complexity

## Why AWS S3 + CloudFront?

**Decision:** Host on S3 with CloudFront CDN instead of Vercel, Netlify, or GitHub Pages.

**Rationale:**
- **Cost control** — Predictable, low cost for a personal site
- **Learning** — Hands-on experience with AWS infrastructure
- **Flexibility** — Can add Lambda@Edge, custom routing later
- **Consolidation** — Already using AWS for other projects

**Alternatives considered:**
- Vercel — Easier DX, but wanted AWS experience
- GitHub Pages — Was using for blog subdomain, caused split
- Netlify — Good option, but AWS alignment was priority

## Why the Migration?

**Decision:** Consolidate `staubracing.com` (static HTML) and `blog.staubracing.com` (Astro) into one site.

**Rationale:**
- **Single domain** — All content under one brand
- **Single deployment** — One push deploys everything
- **Unified design** — Consistent theming across all pages
- **Simpler maintenance** — One repo, one CI/CD pipeline

**Previous state:**
- Main site: Hand-coded HTML on S3
- Blog: Astro on GitHub Pages at `blog.staubracing.com`
- Updated separately, different designs, confusing navigation

## Why Dark Mode Default?

**Decision:** Site loads in dark mode by default.

**Rationale:**
- **Brand fit** — Racing/moto aesthetic leans dark
- **Eye comfort** — Better for evening reading
- **Modern expectation** — Many dev/racing sites default dark
- **User choice preserved** — Light mode available via toggle, persisted in localStorage

## Why No JavaScript Framework?

**Decision:** Use vanilla CSS and minimal JS instead of React, Vue, or Svelte.

**Rationale:**
- **Performance** — No framework overhead
- **Simplicity** — Astro handles interactivity via islands
- **Learning** — Strengthens CSS fundamentals
- **Maintainability** — Fewer dependencies to track

**JavaScript used:**
- Theme toggle (localStorage + DOM manipulation)
- Form submissions (fetch API)
- No client-side routing or state management

## Why CSS Custom Properties?

**Decision:** Use CSS variables instead of SCSS, Tailwind, or CSS-in-JS.

**Rationale:**
- **Native** — No build step, works everywhere
- **Theming** — Enables dark/light mode via variable swap
- **Readability** — `var(--accent-racing)` is self-documenting
- **Portability** — Variables cascade naturally

**Trade-off:** Less tooling than Tailwind, but more explicit and educational.

## Why Trailing Slash Handling?

**Decision:** Normalize paths to handle S3/CloudFront trailing slashes.

```javascript
const currentPath = Astro.url.pathname.replace(/\/$/, '') || '/';
```

**Rationale:**
- **Production reality** — S3/CloudFront serves `/about/` with trailing slash
- **Dev difference** — Local dev serves `/about` without
- **Comparison bugs** — Path matching would fail without normalization

## Why Inlined Nav/Footer?

**Decision:** Navigation and footer are embedded in `Layout.astro` instead of separate components.

**Rationale:**
- **Simplicity** — Fewer files, easier to understand
- **Performance** — No component overhead for static content
- **Edit convenience** — One file to update nav/footer

**Trade-off:** Less reusable, but nav/footer rarely need multiple variants.

## Why File-Based Content?

**Decision:** Store blog posts as Markdown files instead of a CMS.

**Rationale:**
- **Version control** — Content changes are tracked in git
- **No database** — Simpler infrastructure
- **Portability** — Markdown works anywhere
- **Editing** — VS Code with good MDX support

**Trade-off:** No web-based editing UI, but `/new-post` skill scaffolds posts quickly.

## Future Considerations

These decisions can be revisited as needs evolve:

| Decision | Reconsider if... |
|----------|------------------|
| No CMS | Content volume grows significantly |
| Static only | Need real-time features (comments, live updates) |
| AWS hosting | Costs increase or need edge functions |
| Vanilla CSS | Team grows and needs component library |
