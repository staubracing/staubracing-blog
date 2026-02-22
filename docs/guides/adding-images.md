# Adding Images to Blog Posts

How to organize, optimize, and embed images in your blog content.

## Folder Structure

Images are organized by category and post slug:

```
public/images/blog/
├── racing/
│   ├── zx6r-engine-rebuild/
│   │   ├── engine-removal-1.jpg
│   │   ├── engine-removal-2.jpg
│   │   └── engine-workbench.jpg
│   └── other-racing-posts/
├── code/
│   ├── learning-typescript/
│   └── other-code-posts/
├── projects/
│   ├── raspberry-pi-server/
│   └── other-projects/
└── life/
    └── personal-posts/
```

## Using the Helper Script

### Create Image Folders

```bash
node scripts/add-images.js create-folders
```

Scaffolds category directories under `public/images/blog/`.

### Generate HTML Snippets

```bash
node scripts/add-images.js generate-html racing/zx6r-engine-rebuild
```

Prints ready-to-use Markdown/HTML snippets for images in that folder.

## Embedding Images

### Single Image (Markdown)

```markdown
![Alt text describing the image](/images/blog/racing/zx6r-engine-rebuild/zx6r-track-day.jpg)
```

### Image with Detailed Alt Text

```markdown
![Engine with fairings removed showing the valve cover and cam chain area](/images/blog/racing/zx6r-engine-rebuild/engine-fairings-removed.jpg)
```

### Gallery Grid (2x2)

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">
  <img src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-1.jpg" alt="Engine removal step 1" />
  <img src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-2.jpg" alt="Engine removal step 2" />
  <img src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-3.jpg" alt="Engine removal step 3" />
  <img src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-4.jpg" alt="Engine removal step 4" />
</div>
```

### Responsive Image

```html
<img
  src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
  alt="Engine on the workbench ready for disassembly"
  style="max-width: 100%; height: auto;"
/>
```

### Centered with Caption

```html
<div style="text-align: center; margin: 2rem 0;">
  <img
    src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
    alt="Engine on the workbench"
    style="max-width: 100%; height: auto;"
  />
  <p><em>Engine ready for disassembly - notice the organized workspace</em></p>
</div>
```

## Best Practices

### Image Naming

- Use descriptive, lowercase names with hyphens
- ✅ `engine-removal-step-1.jpg`
- ❌ `IMG_001.jpg` or `Engine Removal 1.jpg`

### File Formats

| Format | Use Case |
| ------ | -------- |
| JPG | Photographs and complex images |
| PNG | Screenshots, diagrams, transparency |
| WebP | Better compression (modern browsers) |
| SVG | Icons and simple graphics |

### Optimization

- Resize to reasonable dimensions (max 1200px width)
- Compress to reduce file size
- Always include descriptive alt text

## Styling Tips

### Add Borders

```html
<img
  src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
  alt="Engine on the workbench"
  style="border: 2px solid #ddd; border-radius: 8px;"
/>
```

### Add Shadows

```html
<img
  src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
  alt="Engine on the workbench"
  style="box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
/>
```

## Troubleshooting

### Image Not Showing

1. Check the file path is correct
2. Ensure the image file exists in the right folder
3. Verify the file extension matches

### Image Too Large

1. Resize the image to a reasonable size
2. Use responsive CSS: `max-width: 100%; height: auto;`

### Poor Quality

1. Use higher resolution source images
2. Don't scale up small images
3. Consider WebP format for better compression

## Mobile Considerations

- Images should always be responsive
- Use `max-width: 100%` to prevent overflow
- Consider loading times on slower connections
- Test on different screen sizes
