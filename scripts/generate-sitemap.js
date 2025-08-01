import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define your routes with their corresponding page files
const routes = [
  { url: '/', file: 'src/pages/Index.tsx', priority: '1.0', changefreq: 'weekly' },
  { url: '/ignition', file: 'src/pages/Ignition.tsx', priority: '0.9', changefreq: 'weekly' },
  { url: '/launch-control', file: 'src/pages/LaunchControl.tsx', priority: '0.9', changefreq: 'weekly' },
  { url: '/adventure', file: 'src/pages/Adventure.tsx', priority: '0.7', changefreq: 'monthly' },
  { url: '/transformation', file: 'src/pages/Transformation.tsx', priority: '0.8', changefreq: 'monthly' },
  { url: '/resources', file: 'src/pages/Resources.tsx', priority: '0.8', changefreq: 'weekly' },
];

// Get the last modified date of a file from Git
function getLastModified(filePath) {
  try {
    const relativePath = path.isAbsolute(filePath) 
      ? path.relative(path.join(__dirname, '..'), filePath)
      : filePath;
    
    // Get the last commit date for this file
    const gitDate = execSync(
      `git log -1 --format=%cd --date=short "${relativePath}"`,
      { cwd: path.join(__dirname, '..'), encoding: 'utf8' }
    ).trim();
    
    // If git returns a date, use it; otherwise fallback to file system date
    if (gitDate && gitDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return gitDate;
    }
    
    // Fallback to file system date
    const fullPath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(__dirname, '..', filePath);
    const stats = fs.statSync(fullPath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (error) {
    console.warn(`Warning: Could not get git date for ${filePath}, using current date`);
    return new Date().toISOString().split('T')[0];
  }
}

// Get all markdown files from the posts directory
function getResourcePosts() {
  const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');
  const resourcePosts = [];
  
  try {
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir);
      files.forEach(file => {
        if (file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.tsx')) {
          // Read the file to check if it's hidden
          const filePath = path.join(postsDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          // Check if it's a draft or hidden
          if (file.includes('draft') || fileContent.includes('hidden: true')) {
            console.log(`  Skipping draft/hidden: ${file}`);
            return;
          }
          
          const slug = file
            .replace(/\.(md|mdx|tsx)$/, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
            
          resourcePosts.push({
            url: `/resources/${slug}`,
            file: filePath,
            priority: '0.6',
            changefreq: 'monthly'
          });
        }
      });
    }
  } catch (error) {
    console.log('Error reading posts:', error.message);
  }
  
  return resourcePosts;
}

// Generate the sitemap XML
function generateSitemap() {
  // Get resource posts dynamically
  const resourcePosts = getResourcePosts();
  const allRoutes = [...routes, ...resourcePosts];
  
  const sitemapUrls = allRoutes.map(route => {
    const lastmod = getLastModified(route.file);
    return `  <url>
    <loc>https://vibecto.ai${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

  // Write the sitemap to the public directory
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  
  // Log the routes and their last modified dates
  console.log('\n📅 Route modification dates (from Git commits):');
  allRoutes.forEach(route => {
    const lastmod = getLastModified(route.file);
    console.log(`  ${route.url.padEnd(30)} - ${lastmod}`);
  });
  
  console.log(`\n📊 Total URLs in sitemap: ${allRoutes.length}`);
  console.log('\n💡 Tip: Dates are based on the last Git commit for each file');
}

// Run the generator
generateSitemap();