#!/usr/bin/env node

/**
 * Production Readiness Validation Script
 * Checks if the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating production readiness...\n');

let errors = [];
let warnings = [];

// Check required files
const requiredFiles = [
  'next.config.ts',
  'package.json',
  'vercel.json',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/manifest.json',
  '.github/workflows/ci.yml',
  '.github/dependabot.yml',
  '.lighthouserc.json'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`✅ ${file}`);
  } else {
    errors.push(`Missing required file: ${file}`);
    console.log(`❌ ${file}`);
  }
});

// Check environment variables
console.log('\n🌍 Checking environment configuration...');
const requiredEnvVars = [
  'NEXT_PUBLIC_ADDRESS',
  'NEXT_PUBLIC_PHONE_NUMBER', 
  'NEXT_PUBLIC_MESSENGER_URL'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    warnings.push(`Environment variable ${envVar} is not set`);
    console.log(`⚠️  ${envVar} is not set`);
  }
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  const requiredDeps = ['next', 'react', 'react-dom'];
  const requiredDevDeps = ['typescript', 'eslint', '@next/bundle-analyzer'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} (${packageJson.dependencies[dep]})`);
    } else {
      errors.push(`Missing required dependency: ${dep}`);
    }
  });
  
  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep} (dev)`);
    } else {
      warnings.push(`Missing recommended dev dependency: ${dep}`);
    }
  });
} catch (error) {
  errors.push('Failed to read package.json');
}

// Check build configuration
console.log('\n🔧 Checking build configuration...');
try {
  const nextConfigExists = fs.existsSync(path.join(__dirname, '..', 'next.config.ts'));
  if (nextConfigExists) {
    console.log('✅ Next.js config found');
    
    // Basic config validation
    const configContent = fs.readFileSync(path.join(__dirname, '..', 'next.config.ts'), 'utf8');
    if (configContent.includes('headers()')) {
      console.log('✅ Security headers configured');
    } else {
      warnings.push('Security headers not configured in next.config.ts');
    }
    
    if (configContent.includes('images:')) {
      console.log('✅ Image optimization configured');
    } else {
      warnings.push('Image optimization not configured');
    }
  }
} catch (error) {
  errors.push('Failed to validate Next.js configuration');
}

// Check TypeScript configuration
console.log('\n🔷 Running TypeScript check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript check passed');
} catch (error) {
  errors.push('TypeScript errors found');
  console.log('❌ TypeScript check failed');
}

// Check linting
console.log('\n🔍 Running ESLint check...');
try {
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('✅ ESLint check passed');
} catch (error) {
  warnings.push('ESLint warnings/errors found');
  console.log('⚠️  ESLint issues found');
}

// Check security audit
console.log('\n🔒 Running security audit...');
try {
  execSync('npm audit --audit-level=high', { stdio: 'pipe' });
  console.log('✅ No high-severity vulnerabilities');
} catch (error) {
  warnings.push('High-severity security vulnerabilities found');
  console.log('⚠️  Security vulnerabilities detected');
}

// Check build process
console.log('\n🏗️  Testing build process...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (error) {
  errors.push('Build process failed');
  console.log('❌ Build failed');
}

// Performance recommendations
console.log('\n⚡ Performance recommendations...');
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  const largeImages = files.filter(file => {
    if (!['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())) return false;
    try {
      const stats = fs.statSync(path.join(publicDir, file));
      return stats.size > 500000; // 500KB
    } catch {
      return false;
    }
  });
  
  if (largeImages.length > 0) {
    warnings.push(`Large images detected: ${largeImages.join(', ')}`);
    console.log('⚠️  Consider optimizing large images');
  } else {
    console.log('✅ No large images detected');
  }
}

// SEO validation
console.log('\n🔍 SEO validation...');
const robotsExists = fs.existsSync(path.join(__dirname, '..', 'public', 'robots.txt'));
const sitemapExists = fs.existsSync(path.join(__dirname, '..', 'public', 'sitemap.xml'));

if (robotsExists && sitemapExists) {
  console.log('✅ SEO files present');
} else {
  warnings.push('Missing SEO files (robots.txt, sitemap.xml)');
}

// Final report
console.log('\n📋 VALIDATION REPORT');
console.log('===================');

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 READY FOR PRODUCTION!');
  console.log('All checks passed. Your application is production-ready.');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('\n❌ ERRORS (Must be fixed):');
    errors.forEach(error => console.log(`  • ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (Recommended fixes):');
    warnings.forEach(warning => console.log(`  • ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n🚫 NOT READY FOR PRODUCTION');
    console.log('Please fix the errors above before deploying.');
    process.exit(1);
  } else {
    console.log('\n✅ READY FOR PRODUCTION (with warnings)');
    console.log('Consider addressing the warnings for optimal performance.');
    process.exit(0);
  }
}
