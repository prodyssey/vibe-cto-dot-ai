import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Get the last modified date of a file
function getLastModified(filePath) {
  try {
    const fullPath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(__dirname, '..', filePath);
    const stats = fs.statSync(fullPath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (error) {
    console.warn(`Warning: Could not get modified date for ${filePath}, using current date`);
    return new Date().toISOString().split('T')[0];
  }
}

// Get all markdown files from the resources directory
function getResourcePosts() {
  const resourcesDir = path.join(__dirname, '..', 'src', 'content', 'resources');
  const resourcePosts = [];
  
  try {
    if (fs.existsSync(resourcesDir)) {
      const files = fs.readdirSync(resourcesDir);
      files.forEach(file => {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const slug = file.replace(/\.(md|mdx)$/, '');
          resourcePosts.push({
            url: `/resources/${slug}`,
            file: path.join(resourcesDir, file),
            priority: '0.6',
            changefreq: 'monthly'
          });
        }
      });
    }
  } catch (error) {
    console.log('No resource posts found');
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
  console.log('\n📅 Route modification dates:');
  allRoutes.forEach(route => {
    const lastmod = getLastModified(route.file);
    console.log(`  ${route.url.padEnd(30)} - ${lastmod}`);
  });
  
  console.log(`\n📊 Total URLs in sitemap: ${allRoutes.length}`);
}

// Run the generator
generateSitemap();