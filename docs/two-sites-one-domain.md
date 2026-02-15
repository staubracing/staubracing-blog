---
title: "Two Sites, One Domain, and an Empty Secret Key"
date: 2026-02-15
description: "How I consolidated two websites into one Astro site on AWS, and everything that went wrong along the way"
tags: ["astro", "aws", "s3", "cloudfront", "github-actions", "web-development", "ci-cd"]
author: "StaubRacing"
featured: true
category: "code"
---

I had two websites. One was a static HTML page I hand-coded for my racing presence. The other was an Astro blog on GitHub Pages that I built, posted five times on, and then let collect dust for months. Both lived under the staubracing.com domain. Neither was doing its job particularly well.

This is the story of how I smashed them together into one site, moved everything to AWS, and learned that the most common deployment error in the world is copying a blank field and wondering why authentication failed.

## The Problem

Here's what I was working with: `staubracing.com` was a single-page static HTML site. Clean, minimal, looked good — and said almost nothing. It had my bike specs, one journal entry from October 2024, and a gallery with a single photo. It was a business card pretending to be a website.

Meanwhile, `blog.staubracing.com` was an Astro site deployed to GitHub Pages with actual content — race reports, project writeups, dev posts. It had categories, tags, a dark mode toggle, and personality. But it lived on a subdomain that nobody visited because my social media links all pointed to the main site.

Two sites. Two hosting platforms. Two deployment workflows. Zero reason for any of it.

## The Moment It Clicked

I'd been going back and forth — should I combine everything or keep the sites separate? The racing site felt like *me*. The blog felt like a different *me*. And I kept treating them like they needed different identities, like the guy who races motorcycles on weekends can't also be the guy who deploys Lambda functions on Tuesday night.

But that's stupid. I'm both of those people at the same time. And so is everyone who visits the site.

Think about it — my racing buddies see me pull out a laptop at the track and start debugging API calls. My dev friends know I disappear on race weekends. The people who actually know me don't see two separate identities. They see one person who races bikes, writes code, and tears down engines with the same obsessive focus.

Why would my website pretend otherwise?

The racing site had the brand. The blog had the brains. Combine them and you get something that actually tells the full story — "manufacturing engineer who races motorcycles and builds software" is a way more interesting pitch than any one of those alone.

And then the dominoes started falling.

## The Aha Moment

Once I committed to one site, I started seeing everything differently. I had a links page on the old site that loaded a markdown file with JavaScript, parsed it client-side with regex, and built the DOM on the fly. Worked fine, but a search engine would see nothing but "Loading links..." because the content depended on JavaScript executing.

With Astro? That's just a page. `src/pages/links.astro`. Done. Static HTML. Every crawler sees it. No JavaScript required.

Then I thought about the Claude Code report I'd published at `staubracing.com/report/` — a one-off HTML page I'd manually uploaded to S3. With Astro, that's just another file. `src/pages/report.astro`. Or better yet, write it in markdown and drop it in `src/pages/report.md`. Push to main. It's live.

Want a new page at `/whatever`? Create the file. That's it. File-based routing. No config, no manual S3 uploads, no fighting with CloudFront over whether `/report` should resolve to `/report/index.html`.

I'd been hand-coding HTML pages and wrestling with S3 path resolution like it was 2009, and this whole time Astro could've been doing all of it. Every random thing I wanted to share — reports, links, notes, race schedules — is just a file in a folder. One push and it exists on the internet.

That was the moment I stopped thinking about this as a "blog migration" and started thinking about it as building an actual platform for everything I do.

## The Migration (Where Things Got Interesting)

### Step 1: Deploy the Blog to AWS

Before combining anything, I wanted to prove the pipeline worked. Take the existing Astro blog, deploy it to S3 instead of GitHub Pages, serve it through the same CloudFront distribution as the main site. Baby steps.

The Astro config change was two lines:

```javascript
site: "https://www.staubracing.com",
base: "/blog",
```

The GitHub Actions workflow swap was straightforward — replace the GitHub Pages deploy step with an S3 sync and CloudFront invalidation. Set up three repository secrets: access key ID, secret access key, CloudFront distribution ID.

Pushed to main. Watched the Actions tab. Build passed. Install passed. And then:

```
fatal error: SignatureDoesNotMatch when calling ListObjectsV2
```

### The Empty Secret Key Incident

`SignatureDoesNotMatch` means the access key and secret key don't match. I double-checked the access key. Correct. I went to update the secret key in GitHub Secrets and found the Value field was completely empty.

I had set up three repository secrets and somehow managed to save one of them blank. Just... nothing. An empty string trying to authenticate against AWS. And AWS, to its credit, didn't say "hey, you sent me nothing." It said "the signature doesn't match," which is technically accurate in the most unhelpful way possible.

Pasted the actual key. Re-ran the job. Green checkmark.

### The 403 That Wasn't a 403

Site deployed. Hit `staubracing.com/blog/`. It loaded. Beautiful. Then I tried to navigate to a category page and got:

```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
</Error>
```

Panic. Then I looked at the URL bar: `staubracing.com/category/racing/`. No `/blog` prefix.

I'd been typing the URL without the `/blog` base path. S3 returns a 403 instead of a 404 when you request a path that doesn't exist — it's not "access denied," it's "that path doesn't exist, but I'm not going to tell you that because security." Every AWS developer has lost time to this at least once.

The actual pages at `/blog/category/racing/` worked perfectly. The error was between the keyboard and the chair.

### CloudFront and the index.html Problem

This one I already knew was coming. S3 static hosting has a classic gotcha: if someone requests `/racing/`, S3 doesn't automatically serve `/racing/index.html`. It just shrugs.

The fix is a CloudFront Function that appends `index.html` to directory-style requests. I'd already fought this battle with the original static site. Astro generates the same `/page/index.html` structure, so the existing function handled it. Small win.

But this is the kind of thing that makes you wonder why, in 2026, the largest cloud provider on earth still can't figure out that `/racing/` probably means `/racing/index.html`.

## The Repo Rename (Because I'm Like That)

With the blog repo becoming the main site, `staubracing-blog` wasn't the right name anymore. Renamed it to `staubracing.com`. GitHub allows dots in repo names — common convention for website repos.

Updated the local remote. Tried to push. `Repository not found.`

```bash
git remote set-url origin https://github.com/staubracing/staubracing.com.git
```

That fixed it. Then I renamed the local folder to match, opened it in Cursor, and got "The folder currently open doesn't have a Git repository." Cursor needed to reopen from the new path. Five seconds of confusion, zero actual problems. But my heart rate didn't need that.

## Building the Combined Site

With the pipeline proven, the real work started. The existing blog had five posts, four categories, and a decent layout. The main site had bike specs, race stats, and a hero section with actual presence.

I fed Claude Code a detailed spec — colors, typography, component structure, nav hierarchy, the full design system pulled from a mockup — and built it out. The nav bar came together with main sections up top and contextual sub-navigation that appears when you're inside a section. Racing gets Bikes, Race Results, Gallery. Code gets its own set. Each section has depth without cluttering the top level.

The home page pulls recent posts from every category. Racing next to code next to projects next to life. All on the same page, under the same brand. Exactly how it should've been from the start.

## What I Learned

**Stop splitting yourself into separate brands.** If you do multiple things, own all of them in one place. The person clicking your link from Instagram and the person clicking from GitHub might be the same person. Even if they're not, showing range is more interesting than showing one dimension.

**The interim step was worth it.** I could've tried to build the entire combined site and deploy it all at once. Instead, I deployed the existing blog to AWS first, proved the pipeline worked, then built on top of it. Every step was a working site. Nothing broke between phases.

**Astro is the right tool for content sites.** Not because it's trendy — because it does the boring stuff for you. Blog posts are markdown files in a folder. Pages are components in a folder. Everything builds to static HTML. The gap between "I have an idea for a page" and "it's live on the internet" collapsed from an hour of HTML wrangling to minutes.

**GitHub Secrets can be empty and GitHub won't warn you.** Just a blank field, silently saved, waiting to ruin your deployment. Always verify.

**S3 lies about 403s.** Access Denied usually means "not found." This will never stop being confusing.

## The Stack

For anyone curious about what's running this:

- **Framework**: Astro (static output, zero client-side JS by default)
- **Content**: Markdown with frontmatter, processed at build time
- **Hosting**: AWS S3 (static files)
- **CDN**: AWS CloudFront
- **CI/CD**: GitHub Actions — push to main, auto-deploys
- **DNS**: AWS Route 53
- **Repo**: One. Just one. That's the whole point.

## What's Next

The sub-navigation needs finishing out. Each section should have its own contextual nav — Racing with Bikes, Results, Gallery; Code with project pages; the full tree.

After that, a live race calendar. A buddy has the full track day and race schedule for the region. An interactive calendar component would give people a reason to come back to the site regularly — and every race weekend becomes a natural blog post.

But for now, the two-site era is over. One domain. One repo. One push to deploy. And a site that finally tells the whole story instead of half of it.
