# Astro Components & MDX Tutorial

## Building Reusable Components for Your Blog

### 🎯 **What You'll Learn**

- How Astro components work (vs React)
- Creating reusable components for your blog
- Using MDX for enhanced markdown
- Troubleshooting common issues
- Best practices for static site components

---

## 📚 **Part 1: Understanding Astro Components**

### **Astro vs React Components**

| Feature            | Astro                   | React                |
| ------------------ | ----------------------- | -------------------- |
| **File Extension** | `.astro`                | `.jsx`               |
| **Rendering**      | Server-side by default  | Client-side          |
| **JavaScript**     | No client JS by default | Always includes JS   |
| **Syntax**         | JSX-like                | JSX                  |
| **Props**          | `Astro.props`           | `props` parameter    |
| **Styling**        | Scoped CSS              | CSS-in-JS or modules |

### **Key Differences**

- **Astro components are static-first** - they render to HTML at build time
- **No client-side JavaScript** unless explicitly added
- **Perfect for content-heavy sites** like blogs
- **Better performance** for static content

---

## 🔧 **Part 2: Creating Your First Component**

### **Step 1: Create the Component File**

```bash
mkdir -p src/components
touch src/components/MediaDisplay.astro
```

### **Step 2: Build the Component Structure**

```astro
---
// Frontmatter section (between ---)
// This is where you put component logic

interface Props {
  src: string;
  alt?: string;
  caption?: string;
  type?: 'image' | 'video';
  width?: string;
  height?: string;
}

const {
  src,
  alt = '',
  caption = '',
  type = 'image',
  width = '100%',
  height = 'auto'
} = Astro.props;
---

<!-- Component template (JSX-like syntax) -->
<div class="media-container">
  {type === 'image' ? (
    <img
      src={src}
      alt={alt}
      style={`max-width: ${width}; height: ${height};`}
      class="media-element"
    />
  ) : (
    <video
      controls
      style={`width: ${width}; height: ${height};`}
      class="media-element"
    >
      <source src={src} type="video/mp4">
      Your browser does not support the video tag.
    </video>
  )}

  {caption && (
    <p class="media-caption">{caption}</p>
  )}
</div>

<style>
  /* Scoped CSS - only applies to this component */
  .media-container {
    text-align: center;
    margin: 2rem 0;
  }

  .media-element {
    border: 3px solid #e0e0e0;
    border-radius: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .media-element:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  }

  .media-caption {
    margin-top: 0.5rem;
    font-style: italic;
    color: #666;
    font-size: 0.9rem;
  }
</style>
```

### **Component Breakdown**

#### **Frontmatter Section (`---`)**

- **TypeScript interfaces** for type safety
- **Props destructuring** with default values
- **Component logic** (no client-side JavaScript)

#### **Template Section**

- **JSX-like syntax** for HTML structure
- **Conditional rendering** with `{condition ? true : false}`
- **Dynamic attributes** with `{variable}`

#### **Style Section**

- **Scoped CSS** - styles only apply to this component
- **No CSS conflicts** with other components
- **Automatic class name generation**

---

## 📝 **Part 3: Using Components in Your Blog**

### **Option A: Using Components in MDX Files**

#### **Step 1: Install MDX Support**

```bash
yarn add @astrojs/mdx
```

#### **Step 2: Configure Astro**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  // ... other config
  integrations: [mdx()],
});
```

#### **Step 3: Import Component in Your Page**

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, getEntry } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import MediaDisplay from '../../components/MediaDisplay.astro';

// ... rest of your logic
---

<Layout title={post.data.title}>
  <article class="blog-post">
    <!-- ... other content ... -->

    <Content components={{ MediaDisplay }} />
  </article>
</Layout>
```

#### **Step 4: Use in Your MDX File**

```mdx
---
title: "My Blog Post"
date: 2025-01-01
---

# My Blog Post

Here's some content with a custom component:

<MediaDisplay src="/images/my-image.jpg" alt="My Image" caption="This is a caption" />

And here's a video:

<MediaDisplay
  src="/videos/my-video.mp4"
  type="video"
  width="640px"
  caption="My video description"
/>
```

### **Option B: Using Components in Regular Astro Pages**

```astro
---
// src/pages/my-page.astro
import Layout from '../layouts/Layout.astro';
import MediaDisplay from '../components/MediaDisplay.astro';
---

<Layout title="My Page">
  <h1>My Page</h1>

  <MediaDisplay
    src="/images/my-image.jpg"
    alt="My Image"
    caption="This is a caption"
  />
</Layout>
```

---

## 🚨 **Part 4: Troubleshooting Guide**

### **Problem: Images Not Showing Up**

#### **Checklist:**

1. **File exists?** Verify image is in `public/images/...`
2. **Path correct?** Use `/images/...` (no `public` in path)
3. **Case sensitive?** Linux is case-sensitive
4. **File extension?** `.jpg` vs `.JPG` matters

#### **Debug Steps:**

```bash
# Test direct access
curl http://localhost:4321/images/your-image.jpg

# Check file exists
ls -la public/images/your-image.jpg
```

### **Problem: Component Not Rendering**

#### **Common Causes:**

1. **Wrong file extension** - `.md` doesn't support components, use `.mdx`
2. **Missing MDX integration** - install `@astrojs/mdx`
3. **Component not imported** - check your page imports
4. **Wrong component name** - case-sensitive: `MediaDisplay` not `mediadisplay`

#### **Debug Steps:**

```astro
<!-- Test with plain HTML first -->
<img src="/images/test.jpg" alt="Test" />

<!-- Then test component -->
<MediaDisplay src="/images/test.jpg" alt="Test" />
```

### **Problem: Styling Not Working**

#### **Common Causes:**

1. **CSS not scoped** - check `<style>` tag
2. **Class name conflicts** - use unique class names
3. **CSS specificity** - use `:global()` for global styles

---

## 🎯 **Part 5: Best Practices**

### **Component Design**

- **Single responsibility** - one component, one purpose
- **Flexible props** - use optional props with defaults
- **TypeScript interfaces** - for better development experience
- **Scoped styling** - avoid CSS conflicts

### **File Organization**

```
src/
├── components/
│   ├── MediaDisplay.astro
│   ├── BlogCard.astro
│   └── Navigation.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   └── blog/
└── content/
    └── blog/
        └── my-post.mdx
```

### **Naming Conventions**

- **Components**: PascalCase (`MediaDisplay.astro`)
- **Files**: kebab-case (`my-blog-post.mdx`)
- **Props**: camelCase (`imageSrc`, `captionText`)

### **Performance Tips**

- **Optimize images** - use WebP format when possible
- **Lazy loading** - for images below the fold
- **Minimize client JS** - keep components static when possible

---

## 🔍 **Part 6: Advanced Features**

### **Conditional Rendering**

```astro
---
const { showImage, imageSrc } = Astro.props;
---

{showImage && (
  <MediaDisplay src={imageSrc} alt="Conditional Image" />
)}
```

### **Dynamic Props**

```astro
---
const { images } = Astro.props;
---

{images.map(image => (
  <MediaDisplay
    src={image.src}
    alt={image.alt}
    caption={image.caption}
  />
))}
```

### **Slot Content**

```astro
---
// Component with slot
---

<div class="card">
  <header class="card-header">
    <slot name="header" />
  </header>
  <div class="card-body">
    <slot />
  </div>
</div>

<!-- Usage -->
<Card>
  <h2 slot="header">My Title</h2>
  <p>This is the body content</p>
</Card>
```

---

## 📚 **Part 7: Learning Resources**

### **Official Documentation**

- [Astro Components](https://docs.astro.build/en/core-concepts/astro-components/)
- [MDX Integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)

### **Key Concepts to Master**

1. **Static vs Dynamic rendering**
2. **Component props and interfaces**
3. **Scoped CSS in Astro**
4. **MDX vs Markdown**
5. **Content collections**

---

## 🎉 **Summary**

You've successfully:

- ✅ Created a reusable `MediaDisplay` component
- ✅ Integrated MDX for enhanced markdown
- ✅ Troubleshot image display issues
- ✅ Learned Astro component patterns

### **Next Steps**

1. **Create more components** for your blog (navigation, cards, etc.)
2. **Experiment with different prop types**
3. **Add more interactive features** (if needed)
4. **Optimize for performance**

### **Remember**

- **Astro is static-first** - perfect for blogs
- **Components are reusable** - build once, use everywhere
- **MDX enables components** in markdown
- **TypeScript helps** catch errors early

---

_Happy coding! 🚀_
