#!/usr/bin/env node

/**
 * Blog Image Helper Script
 *
 * This script helps you organize and add images to your blog posts.
 *
 * Usage:
 * 1. Create image folders: node scripts/add-images.js create-folders
 * 2. Generate image HTML: node scripts/add-images.js generate-html <post-slug>
 */

const fs = require("fs");
const path = require("path");
const categoriesData = require("../src/content/categories.json");

const PUBLIC_IMAGES_DIR = "public/images/blog";
const CATEGORIES = categoriesData.categories;

function createImageFolders() {
  CATEGORIES.forEach((category) => {
    const categoryPath = path.join(PUBLIC_IMAGES_DIR, category);

    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`✅ Created folder: ${categoryPath}`);
    }
  });

  console.log("\n📁 Image folder structure created!");
  console.log("Now you can add images to the appropriate folders:");
  CATEGORIES.forEach((category) => {
    console.log(`  - public/images/blog/${category}/`);
  });
}

function generateImageHTML(postSlug) {
  if (!postSlug) {
    console.log("❌ Please provide a post slug");
    console.log("Example: node scripts/add-images.js generate-html zx6r-engine-rebuild");
    return;
  }

  const [category, ...slugParts] = postSlug.split("/");
  const slug = slugParts.join("/") || category;
  const imagePath = `/images/blog/${category}/${slug}`;

  console.log("\n📝 Image HTML snippets for your blog post:");
  console.log("==========================================");

  console.log("\n1️⃣ Single image:");
  console.log(`![Description of image](${imagePath}/image-name.jpg)`);

  console.log("\n2️⃣ Image with custom alt text:");
  console.log(`![Detailed description for accessibility](${imagePath}/image-name.jpg)`);

  console.log("\n3️⃣ Gallery grid (2x2):");
  console.log(
    `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">`
  );
  console.log(`  <img src="${imagePath}/image1.jpg" alt="Description 1" />`);
  console.log(`  <img src="${imagePath}/image2.jpg" alt="Description 2" />`);
  console.log(`  <img src="${imagePath}/image3.jpg" alt="Description 3" />`);
  console.log(`  <img src="${imagePath}/image4.jpg" alt="Description 4" />`);
  console.log(`</div>`);

  console.log("\n4️⃣ Responsive image:");
  console.log(
    `<img src="${imagePath}/image-name.jpg" alt="Description" style="max-width: 100%; height: auto;" />`
  );

  console.log("\n📂 Expected image folder:");
  console.log(`public/images/blog/${category}/${slug}/`);
}

function showHelp() {
  console.log("\n🖼️  Blog Image Helper");
  console.log("==================");
  console.log("\nCommands:");
  console.log("  create-folders     - Create the basic folder structure");
  console.log("  generate-html      - Generate HTML snippets for a specific post");
  console.log("  help               - Show this help message");
  console.log("\nExamples:");
  console.log("  node scripts/add-images.js create-folders");
  console.log("  node scripts/add-images.js generate-html racing/zx6r-engine-rebuild");
  console.log("  node scripts/add-images.js generate-html code/learning-typescript");
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "create-folders":
    createImageFolders();
    break;
  case "generate-html":
    generateImageHTML(process.argv[3]);
    break;
  case "help":
  default:
    showHelp();
    break;
}
