#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract a still frame from a video file using ffmpeg
 * Usage: node scripts/extract-video-poster.js <video-path> [output-path] [timestamp]
 */

function extractPosterFrame(videoPath, outputPath = null, timestamp = '00:00:02') {
  // Check if video file exists
  if (!fs.existsSync(videoPath)) {
    console.error(`Error: Video file not found: ${videoPath}`);
    process.exit(1);
  }

  // Generate output path if not provided
  if (!outputPath) {
    const ext = path.extname(videoPath);
    const baseName = path.basename(videoPath, ext);
    const dir = path.dirname(videoPath);
    outputPath = path.join(dir, `${baseName}-poster.jpg`);
  }

  // Check if ffmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Error: ffmpeg is not installed or not in PATH');
    console.error('Install ffmpeg: https://ffmpeg.org/download.html');
    process.exit(1);
  }

  // Extract frame using ffmpeg
  try {
    const command = `ffmpeg -i "${videoPath}" -ss ${timestamp} -vframes 1 -q:v 2 -y "${outputPath}"`;
    console.log(`Extracting poster frame from ${videoPath} at ${timestamp}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Poster frame saved to: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error extracting poster frame:', error.message);
    process.exit(1);
  }
}

// Command line usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/extract-video-poster.js <video-path> [output-path] [timestamp]');
    console.log('Example: node scripts/extract-video-poster.js public/videos/my-video.mp4');
    console.log('Example: node scripts/extract-video-poster.js public/videos/my-video.mp4 public/images/poster.jpg 00:00:05');
    process.exit(1);
  }

  const [videoPath, outputPath, timestamp] = args;
  extractPosterFrame(videoPath, outputPath, timestamp);
}

export { extractPosterFrame };