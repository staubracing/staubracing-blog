import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = new URL('./', import.meta.url);
const files = fs.readdirSync(new URL('.', import.meta.url)).filter(f => f.endsWith('.md'));

export default files.map((file) => {
  const filePath = new URL(file, postsDir);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  return {
    url: `/content/blog/${file.replace('.md', '')}.html`,
    frontmatter: data
  };
});
