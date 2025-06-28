# 📸 Blog Image Guide

This guide shows you how to add images to your blog posts effectively.

## 🗂️ Folder Structure

Your images should be organized like this:

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

## 🖼️ How to Add Images

### 1. **Single Image**

```markdown
![My ZX6R at the track before the engine issues](/images/blog/racing/zx6r-engine-rebuild/zx6r-track-day.jpg)
```

### 2. **Image with Detailed Alt Text**

```markdown
![Engine with fairings removed showing the valve cover and cam chain area](/images/blog/racing/zx6r-engine-rebuild/engine-fairings-removed.jpg)
```

### 3. **Gallery Grid (2x2)**

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">
  <img
    src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-1.jpg"
    alt="Engine removal step 1"
  />
  <img
    src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-2.jpg"
    alt="Engine removal step 2"
  />
  <img
    src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-3.jpg"
    alt="Engine removal step 3"
  />
  <img
    src="/images/blog/racing/zx6r-engine-rebuild/engine-removal-4.jpg"
    alt="Engine removal step 4"
  />
</div>
```

### 4. **Responsive Image**

```html
<img
  src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
  alt="Engine on the workbench ready for disassembly"
  style="max-width: 100%; height: auto;"
/>
```

### 5. **Centered Image**

```html
<div style="text-align: center; margin: 2rem 0;">
  <img
    src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
    alt="Engine on the workbench ready for disassembly"
    style="max-width: 100%; height: auto;"
  />
  <p><em>Engine ready for disassembly on the workbench</em></p>
</div>
```

## 🛠️ Using the Helper Script

### Create Image Folders

```bash
node scripts/add-images.js create-folders
```

### Generate HTML Snippets

```bash
node scripts/add-images.js generate-html racing/zx6r-engine-rebuild
```

## 📋 Best Practices

### **Image Naming**

- Use descriptive, lowercase names with hyphens
- ✅ `engine-removal-step-1.jpg`
- ❌ `IMG_001.jpg` or `Engine Removal 1.jpg`

### **File Formats**

- **JPG**: For photographs and complex images
- **PNG**: For screenshots, diagrams, or images with transparency
- **WebP**: For better compression (modern browsers)
- **SVG**: For icons and simple graphics

### **Image Optimization**

- Resize images to reasonable dimensions (max 1200px width)
- Compress images to reduce file size
- Use descriptive alt text for accessibility

### **Organization Tips**

- Create a folder for each blog post or series
- Use consistent naming conventions
- Keep related images together

## 🎯 Examples by Category

### **Racing Posts**

```
public/images/blog/racing/zx6r-engine-rebuild/
├── bike-track-day.jpg
├── engine-removal-1.jpg
├── engine-removal-2.jpg
├── engine-workbench.jpg
└── damage-found.jpg
```

### **Code Posts**

```
public/images/blog/code/learning-typescript/
├── typescript-setup.jpg
├── code-example-1.png
├── error-message.png
└── final-result.jpg
```

### **Project Posts**

```
public/images/blog/projects/raspberry-pi-server/
├── pi-setup.jpg
├── network-diagram.png
├── server-dashboard.png
└── final-installation.jpg
```

## 🔧 Troubleshooting

### **Image Not Showing**

1. Check the file path is correct
2. Ensure the image file exists in the right folder
3. Verify the file extension matches

### **Image Too Large**

1. Resize the image to a reasonable size
2. Use responsive CSS: `max-width: 100%; height: auto;`

### **Poor Image Quality**

1. Use higher resolution source images
2. Don't scale up small images
3. Consider using WebP format for better compression

## 📱 Mobile Considerations

- Images should be responsive
- Use `max-width: 100%` to prevent overflow
- Consider loading times on slower connections
- Test on different screen sizes

## 🎨 Styling Tips

### **Add Captions**

```html
<div style="text-align: center; margin: 2rem 0;">
  <img
    src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
    alt="Engine on the workbench"
  />
  <p><em>Engine ready for disassembly - notice the organized workspace</em></p>
</div>
```

### **Add Borders**

```html
<img
  src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
  alt="Engine on the workbench"
  style="border: 2px solid #ddd; border-radius: 8px;"
/>
```

### **Add Shadows**

```html
<img
  src="/images/blog/racing/zx6r-engine-rebuild/engine-workbench.jpg"
  alt="Engine on the workbench"
  style="box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
/>
```

---

**Remember**: Good images can make or break a blog post. Take the time to organize them well and write descriptive alt text for accessibility! 🚀
