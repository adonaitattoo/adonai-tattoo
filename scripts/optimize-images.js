#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Image Optimization Script
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const GALLERY_DIR = path.join(PUBLIC_DIR, 'gallery_images');

// Image optimization settings
const OPTIMIZATION_SETTINGS = {
  // For gallery images
  gallery: {
    quality: 85,
    progressive: true,
    mozjpeg: true,
    formats: ['jpeg', 'webp']
  },
  // For thumbnails
  thumbnails: {
    width: 400,
    height: 400,
    quality: 80,
    fit: 'cover'
  },
  // For hero/large images
  hero: {
    quality: 90,
    progressive: true,
    mozjpeg: true,
    maxWidth: 1920
  }
};

async function optimizeImage(inputPath, outputPath, settings) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Optimizing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);
    
    let pipeline = image;
    
    // Resize if needed
    if (settings.maxWidth && metadata.width > settings.maxWidth) {
      pipeline = pipeline.resize(settings.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    if (settings.width && settings.height) {
      pipeline = pipeline.resize(settings.width, settings.height, {
        fit: settings.fit || 'cover'
      });
    }
    
    // Apply JPEG optimization
    if (inputPath.toLowerCase().includes('.jpg') || inputPath.toLowerCase().includes('.jpeg')) {
      pipeline = pipeline.jpeg({
        quality: settings.quality || 85,
        progressive: settings.progressive || true,
        mozjpeg: settings.mozjpeg || true
      });
    }
    
    await pipeline.toFile(outputPath);
    
    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`  Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(1)}KB`);
    console.log(`  Savings: ${savings}%\n`);
    
    return { originalSize, optimizedSize, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function generateWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    console.log(`Generated WebP: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error generating WebP for ${inputPath}:`, error.message);
  }
}

async function optimizeDirectory(dirPath, settings) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist, skipping...`);
    return { totalSavings: 0, filesProcessed: 0 };
  }
  
  const files = fs.readdirSync(dirPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file) && !file.includes('.optimized.')
  );
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let filesProcessed = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(dirPath, file);
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const optimizedPath = path.join(dirPath, `${name}.optimized${ext}`);
    
    const result = await optimizeImage(inputPath, optimizedPath, settings);
    
    if (result) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      filesProcessed++;
      
      // Generate WebP version if it's a JPEG/PNG
      if (ext.toLowerCase() !== '.webp') {
        const webpPath = path.join(dirPath, `${name}.webp`);
        await generateWebP(inputPath, webpPath);
      }
    }
  }
  
  return {
    totalSavings: totalOriginalSize ? ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100) : 0,
    filesProcessed,
    totalOriginalSize,
    totalOptimizedSize
  };
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  const directories = [
    { path: PUBLIC_DIR, settings: OPTIMIZATION_SETTINGS.hero, name: 'Public Assets' },
    { path: GALLERY_DIR, settings: OPTIMIZATION_SETTINGS.gallery, name: 'Gallery Images' }
  ];
  
  let grandTotalOriginal = 0;
  let grandTotalOptimized = 0;
  let grandTotalFiles = 0;
  
  for (const { path: dirPath, settings, name } of directories) {
    console.log(`📁 Optimizing ${name}...`);
    const result = await optimizeDirectory(dirPath, settings);
    
    console.log(`✅ ${name} complete:`);
    console.log(`   Files processed: ${result.filesProcessed}`);
    console.log(`   Total savings: ${result.totalSavings.toFixed(1)}%`);
    console.log(`   Size reduction: ${((result.totalOriginalSize - result.totalOptimizedSize) / 1024).toFixed(1)}KB\n`);
    
    grandTotalOriginal += result.totalOriginalSize;
    grandTotalOptimized += result.totalOptimizedSize;
    grandTotalFiles += result.filesProcessed;
  }
  
  console.log('🎉 Optimization Summary:');
  console.log(`   Total files processed: ${grandTotalFiles}`);
  console.log(`   Total original size: ${(grandTotalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total optimized size: ${(grandTotalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total savings: ${grandTotalOriginal ? ((grandTotalOriginal - grandTotalOptimized) / grandTotalOriginal * 100).toFixed(1) : 0}%`);
  console.log(`   Storage saved: ${((grandTotalOriginal - grandTotalOptimized) / 1024 / 1024).toFixed(2)}MB`);
  
  console.log('\n💡 Tips:');
  console.log('   - WebP versions created for better compression');
  console.log('   - Use .optimized.jpg files for production');
  console.log('   - Consider serving WebP to supported browsers');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  optimizeImage,
  generateWebP,
  optimizeDirectory,
  OPTIMIZATION_SETTINGS
};
