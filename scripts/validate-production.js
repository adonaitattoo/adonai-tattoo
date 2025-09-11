#!/usr/bin/env node

/**
 * Production Readiness Validation Script
 * Usage: node scripts/validate-production.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  requiredEnvVars: [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'ADMIN_EMAIL',
    'NEXTAUTH_SECRET'
  ],
  requiredFiles: [
    'next.config.ts',
    'middleware.ts',
    'public/manifest.json',
    'public/robots.txt',
    'src/app/layout.tsx',
    'src/lib/firebase.ts',
    'src/lib/firebase-client-admin.ts'
  ],
  requiredDirs: [
    'src/app/admin',
    'src/app/api/admin',
    'src/components',
    'public'
  ],
  buildDir: '.next',
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxBuildSize: 50 * 1024 * 1024 // 50MB
};

class ProductionValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      error: '❌',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  addError(message) {
    this.errors.push(message);
    this.log(message, 'error');
  }

  addWarning(message) {
    this.warnings.push(message);
    this.log(message, 'warning');
  }

  addSuccess(message) {
    this.passed.push(message);
    this.log(message, 'success');
  }

  validateEnvironmentVariables() {
    this.log('Validating environment variables...', 'info');
    
    // Check for .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      this.addError('.env.local file not found');
      return;
    }

    // Read environment variables
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = new Set();
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key] = trimmed.split('=');
        if (key) {
          envVars.add(key.trim());
        }
      }
    });

    // Check required variables
    CONFIG.requiredEnvVars.forEach(varName => {
      if (envVars.has(varName)) {
        this.addSuccess(`Environment variable ${varName} is set`);
      } else {
        this.addError(`Missing required environment variable: ${varName}`);
      }
    });

    // Check for sensitive data exposure
    const publicVars = Array.from(envVars).filter(v => v.startsWith('NEXT_PUBLIC_'));
    if (publicVars.some(v => v.toLowerCase().includes('secret') || v.toLowerCase().includes('private'))) {
      this.addError('Sensitive data may be exposed in NEXT_PUBLIC_ variables');
    }
  }

  validateFileStructure() {
    this.log('Validating file structure...', 'info');

    // Check required files
    CONFIG.requiredFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        this.addSuccess(`Required file exists: ${filePath}`);
      } else {
        this.addError(`Missing required file: ${filePath}`);
      }
    });

    // Check required directories
    CONFIG.requiredDirs.forEach(dirPath => {
      const fullPath = path.join(process.cwd(), dirPath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        this.addSuccess(`Required directory exists: ${dirPath}`);
      } else {
        this.addError(`Missing required directory: ${dirPath}`);
      }
    });
  }

  validatePackageJson() {
    this.log('Validating package.json...', 'info');
    
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

      // Check required scripts
      const requiredScripts = ['build', 'start', 'dev'];
      requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.addSuccess(`Required script exists: ${script}`);
        } else {
          this.addError(`Missing required script: ${script}`);
        }
      });

      // Check Firebase dependencies
      const requiredDeps = ['firebase', 'next', 'react'];
      requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.addSuccess(`Required dependency exists: ${dep}`);
        } else {
          this.addError(`Missing required dependency: ${dep}`);
        }
      });

      // Check for security vulnerabilities in dependencies
      if (packageJson.dependencies) {
        const deps = Object.keys(packageJson.dependencies);
        if (deps.length > 50) {
          this.addWarning(`Large number of dependencies (${deps.length}). Consider auditing for unused packages.`);
        }
      }

    } catch (error) {
      this.addError(`Failed to parse package.json: ${error.message}`);
    }
  }

  validateBuildOutput() {
    this.log('Validating build output...', 'info');

    const buildPath = path.join(process.cwd(), CONFIG.buildDir);
    if (!fs.existsSync(buildPath)) {
      this.addWarning('Build directory not found. Run "npm run build" first for complete validation.');
      return;
    }

    try {
      // Check build size
      const buildSize = this.getDirectorySize(buildPath);
      if (buildSize > CONFIG.maxBuildSize) {
        this.addWarning(`Build size (${(buildSize / 1024 / 1024).toFixed(2)}MB) exceeds recommended limit (${CONFIG.maxBuildSize / 1024 / 1024}MB)`);
      } else {
        this.addSuccess(`Build size (${(buildSize / 1024 / 1024).toFixed(2)}MB) is within limits`);
      }

      // Check for essential build files
      const essentialFiles = [
        'static',
        'server/app',
        'server/pages'
      ];

      essentialFiles.forEach(file => {
        const filePath = path.join(buildPath, file);
        if (fs.existsSync(filePath)) {
          this.addSuccess(`Build file exists: ${file}`);
        } else {
          this.addWarning(`Build file missing: ${file}`);
        }
      });

    } catch (error) {
      this.addError(`Failed to validate build output: ${error.message}`);
    }
  }

  validateImages() {
    this.log('Validating images...', 'info');

    const publicPath = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicPath)) {
      this.addError('Public directory not found');
      return;
    }

    const imageFiles = this.findImageFiles(publicPath);
    let totalImageSize = 0;

    imageFiles.forEach(imagePath => {
      const stats = fs.statSync(imagePath);
      totalImageSize += stats.size;

      if (stats.size > CONFIG.maxImageSize) {
        this.addWarning(`Large image file (${(stats.size / 1024 / 1024).toFixed(2)}MB): ${path.relative(process.cwd(), imagePath)}`);
      }
    });

    if (imageFiles.length > 0) {
      this.addSuccess(`Found ${imageFiles.length} image files (${(totalImageSize / 1024 / 1024).toFixed(2)}MB total)`);
    }

    // Check for next/image optimization
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
      if (configContent.includes('images:') && configContent.includes('remotePatterns')) {
        this.addSuccess('Next.js image optimization configured');
      } else {
        this.addWarning('Next.js image optimization may not be fully configured');
      }
    }
  }

  validateSecurity() {
    this.log('Validating security configuration...', 'info');

    // Check middleware
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
      if (middlewareContent.includes('/admin')) {
        this.addSuccess('Admin route protection configured');
      } else {
        this.addWarning('Admin route protection may not be configured');
      }
    } else {
      this.addError('Middleware file not found');
    }

    // Check next.config security headers
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
      if (configContent.includes('headers:')) {
        this.addSuccess('Security headers configured');
      } else {
        this.addWarning('Security headers may not be configured');
      }
    }
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += this.getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    });
    
    return totalSize;
  }

  findImageFiles(dirPath) {
    const imageFiles = [];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        imageFiles.push(...this.findImageFiles(itemPath));
      } else {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext)) {
          imageFiles.push(itemPath);
        }
      }
    });
    
    return imageFiles;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 PRODUCTION READINESS REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Passed: ${this.passed.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }
    
    const score = Math.round((this.passed.length / (this.passed.length + this.warnings.length + this.errors.length)) * 100);
    
    console.log(`\n📊 READINESS SCORE: ${score}%`);
    
    if (this.errors.length === 0) {
      console.log('\n🎉 Your application is ready for production!');
      if (this.warnings.length > 0) {
        console.log('💡 Consider addressing warnings for optimal performance.');
      }
    } else {
      console.log('\n🛑 Your application needs attention before production deployment.');
      console.log('🔧 Please fix the errors listed above.');
    }
    
    console.log('\n📚 Helpful commands:');
    console.log('   npm run build          - Build for production');
    console.log('   npm run optimize-images - Optimize images for better performance');
    console.log('   npm run lint           - Check code quality');
    console.log('   npm audit              - Check for security vulnerabilities');
    
    return this.errors.length === 0;
  }

  async validate() {
    console.log('🔍 Starting production readiness validation...\n');
    
    this.validateEnvironmentVariables();
    this.validateFileStructure();
    this.validatePackageJson();
    this.validateBuildOutput();
    this.validateImages();
    this.validateSecurity();
    
    return this.generateReport();
  }
}

async function main() {
  const validator = new ProductionValidator();
  const isReady = await validator.validate();
  
  process.exit(isReady ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionValidator;
