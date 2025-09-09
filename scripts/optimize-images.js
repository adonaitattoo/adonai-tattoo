#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts images to WebP format with fallbacks
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Image optimization settings
const QUALITY_SETTINGS = {
  webp: { quality: 85, effort: 6 },
  avif: { quality: 75, effort: 9 },
  jpeg: { quality: 85, progressive: true },
  png: { compressionLevel: 9, adaptiveFiltering: true }
};

// Responsive image sizes
const RESPONSIVE_SIZES = [640, 768, 1024, 1280, 1600];

async function optimizeImage(inputPath, outputDir, filename) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Processing: ${filename} (${metadata.width}x${metadata.height})`);

    // Generate WebP version
    await image
      .webp(QUALITY_SETTINGS.webp)
      .toFile(path.join(outputDir, `${filename}.webp`));

    // Generate AVIF version (modern browsers)
    await image
      .avif(QUALITY_SETTINGS.avif)
      .toFile(path.join(outputDir, `${filename}.avif`));

    // Generate responsive versions for large images
    if (metadata.width > 800) {
      for (const size of RESPONSIVE_SIZES) {
        if (size < metadata.width) {
          // WebP responsive
          await image
            .resize(size, null, { withoutEnlargement: true })
            .webp(QUALITY_SETTINGS.webp)
            .toFile(path.join(outputDir, `${filename}-${size}w.webp`));

          // JPEG fallback responsive
          await image
            .resize(size, null, { withoutEnlargement: true })
            .jpeg(QUALITY_SETTINGS.jpeg)
            .toFile(path.join(outputDir, `${filename}-${size}w.jpg`));
        }
      }
    }

    // Optimize original format as fallback
    const ext = path.extname(inputPath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg(QUALITY_SETTINGS.jpeg)
        .toFile(path.join(outputDir, `${filename}.jpg`));
    } else if (ext === '.png') {
      await image
        .png(QUALITY_SETTINGS.png)
        .toFile(path.join(outputDir, `${filename}.png`));
    }

    console.log(`✅ Optimized: ${filename}`);
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

async function generateFavicons() {
  const logoPath = path.join(INPUT_DIR, 'AdonaiTattooLogo.png');
  
  if (!fs.existsSync(logoPath)) {
    console.log('⚠️  Logo not found, skipping favicon generation');
    return;
  }

  console.log('🎨 Generating favicons...');
  
  const sizes = [16, 32, 48, 64, 96, 128, 144, 152, 192, 384, 512];
  
  for (const size of sizes) {
    await sharp(logoPath)
      .resize(size, size)
      .png()
      .toFile(path.join(INPUT_DIR, `favicon-${size}x${size}.png`));
  }

  // Generate ICO file (requires specific library)
  await sharp(logoPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(INPUT_DIR, 'favicon.ico'));

  // Apple touch icons
  const appleSizes = [57, 72, 114, 144];
  for (const size of appleSizes) {
    await sharp(logoPath)
      .resize(size, size)
      .png()
      .toFile(path.join(INPUT_DIR, `apple-touch-icon-${size}x${size}.png`));
  }

  console.log('✅ Favicons generated');
}

async function generateOGImages() {
  console.log('🖼️  Generating OG images...');
  
  // Create OG image template (1200x630)
  const ogImage = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  });

  // Add text overlay (simplified - in production you'd want better text rendering)
  await ogImage
    .composite([
      {
        input: Buffer.from(`
          <svg width="1200" height="630">
            <rect width="1200" height="630" fill="#000000"/>
            <text x="600" y="300" font-family="Arial" font-size="60" fill="#dc2626" text-anchor="middle">
              Adonai Tattoo
            </text>
            <text x="600" y="380" font-family="Arial" font-size="30" fill="#ffffff" text-anchor="middle">
              Faith-Inspired Artistry | Evansville, IN
            </text>
          </svg>
        `),
        top: 0,
        left: 0,
      }
    ])
    .png()
    .toFile(path.join(INPUT_DIR, 'og-image.png'));

  // Generate Twitter card (1200x600)
  await sharp({
    create: {
      width: 1200,
      height: 600,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
    .composite([
      {
        input: Buffer.from(`
          <svg width="1200" height="600">
            <rect width="1200" height="600" fill="#000000"/>
            <text x="600" y="280" font-family="Arial" font-size="55" fill="#dc2626" text-anchor="middle">
              Adonai Tattoo
            </text>
            <text x="600" y="350" font-family="Arial" font-size="28" fill="#ffffff" text-anchor="middle">
              Faith-Inspired Artistry | Evansville, IN
            </text>
          </svg>
        `),
        top: 0,
        left: 0,
      }
    ])
    .png()
    .toFile(path.join(INPUT_DIR, 'twitter-image.png'));

  console.log('✅ OG images generated');
}

async function processAllImages() {
  console.log('🚀 Starting image optimization...');
  
  // Generate favicons and OG images first
  await generateFavicons();
  await generateOGImages();
  
  // Process existing images
  const files = fs.readdirSync(INPUT_DIR);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && 
           !file.startsWith('favicon') && 
           !file.startsWith('apple-touch') &&
           !file.includes('og-image') &&
           !file.includes('twitter-image');
  });

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const filename = path.parse(file).name;
    await optimizeImage(inputPath, OUTPUT_DIR, filename);
  }

  // Process gallery images
  const galleryDir = path.join(INPUT_DIR, 'gallery_images');
  if (fs.existsSync(galleryDir)) {
    const galleryFiles = fs.readdirSync(galleryDir);
    const galleryImages = galleryFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    const galleryOutputDir = path.join(OUTPUT_DIR, 'gallery_images');
    if (!fs.existsSync(galleryOutputDir)) {
      fs.mkdirSync(galleryOutputDir, { recursive: true });
    }

    for (const file of galleryImages) {
      const inputPath = path.join(galleryDir, file);
      const filename = path.parse(file).name;
      await optimizeImage(inputPath, galleryOutputDir, filename);
    }
  }

  console.log('🎉 Image optimization complete!');
  console.log(`📊 Processed ${imageFiles.length} images`);
}

// Run the optimization
processAllImages().catch(console.error);
