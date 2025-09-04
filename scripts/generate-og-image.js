#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

/**
 * Generate OG image using Sharp's composite capabilities
 * Creates a layered image with background, text, and avatar
 */
async function generateOGImage() {
  console.log('🎨 Generating OG image using Sharp...');
  
  try {
    // Check if public directory exists
    if (!existsSync(publicDir)) {
      throw new Error(`Public directory not found: ${publicDir}`);
    }
    
    const outputPath = join(publicDir, 'vibe-cto-og.png');
    
    // Create gradient background
    const gradientSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="25%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#7c3aed"/>
            <stop offset="75%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <radialGradient id="orb1" cx="0%" cy="0%" r="50%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb2" cx="100%" cy="100%" r="40%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb3" cx="80%" cy="20%" r="30%">
            <stop offset="0%" stop-color="#ec4899" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
          </radialGradient>
        </defs>
        
        <!-- Base gradient -->
        <rect width="1200" height="630" fill="url(#bgGradient)"/>
        
        <!-- Decorative orbs -->
        <rect width="1200" height="630" fill="url(#orb1)"/>
        <rect width="1200" height="630" fill="url(#orb2)"/>
        <rect width="1200" height="630" fill="url(#orb3)"/>
      </svg>
    `;
    
    // Logo SVG
    const logoSvg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6"/>
            <stop offset="50%" stop-color="#8B5CF6"/>
            <stop offset="100%" stop-color="#EC4899"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="#0f172a" opacity="0.8"/>
        <path d="M 30 30 L 20 30 L 20 50 L 20 70 L 30 70" stroke="url(#logoGrad)" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 35 50 Q 42.5 40, 50 50 T 65 50" stroke="url(#logoGrad)" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 70 30 L 80 30 L 80 50 L 80 70 L 70 70" stroke="url(#logoGrad)" stroke-width="4" stroke-linecap="round" fill="none"/>
      </svg>
    `;
    
    // Text overlays using SVG for better control
    const textSvg = `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#60a5fa"/>
            <stop offset="50%" stop-color="#a78bfa"/>
            <stop offset="100%" stop-color="#ec4899"/>
          </linearGradient>
          <style>
            <![CDATA[
              .title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 900; }
              .tagline { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; }
              .desc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 400; }
            ]]>
          </style>
        </defs>
        
        <!-- Logo Text -->
        <text x="120" y="70" class="title" font-size="64" fill="white" letter-spacing="-2px">VibeCTO</text>
        <text x="460" y="70" class="title" font-size="64" fill="url(#textGradient)" letter-spacing="-2px">.ai</text>
        
        <!-- Main Tagline -->
        <text x="0" y="150" class="tagline" font-size="44" fill="white">Human help to build</text>
        <text x="0" y="200" class="tagline" font-size="44" fill="url(#textGradient)">with AI</text>
        
        <!-- Description -->
        <text x="0" y="250" class="desc" font-size="22" fill="rgba(255,255,255,0.9)">Elite AI augmented engineering and vibe coding guidance.</text>
        <text x="0" y="280" class="desc" font-size="22" fill="rgba(255,255,255,0.8)">I work with builders to adopt AI and accelerate</text>
        <text x="0" y="310" class="desc" font-size="22" fill="rgba(255,255,255,0.8)">roadmaps, operations, and prototypes.</text>
      </svg>
    `;
    
    // Create base background
    const background = sharp(Buffer.from(gradientSvg))
      .png();
    
    // Create logo
    const logo = sharp(Buffer.from(logoSvg))
      .resize(80, 80)
      .png();
    
    // Create text overlay
    const textOverlay = sharp(Buffer.from(textSvg))
      .png();
    
    // Check if avatar image exists
    const avatarDir = join(publicDir, 'images');
    const avatarPath = join(avatarDir, 'craig-avatar-pixelated.png');
    let avatarBuffer = null;
    
    if (existsSync(avatarPath)) {
      console.log('📷 Found avatar image, including it in the composition');
      avatarBuffer = await sharp(avatarPath)
        .resize(320, 320, { 
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
    } else {
      console.log('⚠️  Avatar image not found, creating placeholder');
      // Create a simple avatar placeholder
      const avatarPlaceholder = `
        <svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="160" cy="160" r="140" fill="url(#avatarGlow)"/>
          <circle cx="160" cy="160" r="120" fill="rgba(139, 92, 246, 0.3)" stroke="#8b5cf6" stroke-width="2"/>
          <text x="160" y="170" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                font-size="24" font-weight="600" fill="white" opacity="0.9">VibeCTO</text>
        </svg>
      `;
      avatarBuffer = await sharp(Buffer.from(avatarPlaceholder))
        .png()
        .toBuffer();
    }
    
    // Composite all elements
    const compositeElements = [
      { input: await logo.toBuffer(), left: 80, top: 120 },
      { input: await textOverlay.toBuffer(), left: 80, top: 120 },
    ];
    
    if (avatarBuffer) {
      compositeElements.push({ input: avatarBuffer, left: 800, top: 155 });
    }
    
    await background
      .composite(compositeElements)
      .png({
        quality: 90,
        compressionLevel: 6
      })
      .toFile(outputPath);
    
    console.log('✅ OG image generated successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log('📐 Dimensions: 1200x630 pixels');
    console.log('📄 Format: PNG');
    console.log('🎯 Content: "Human help to build with AI" messaging');
    
  } catch (error) {
    console.error('❌ Failed to generate OG image:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOGImage();
}

export { generateOGImage };