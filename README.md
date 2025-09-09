# 🎨 Adonai Tattoo - Faith-Inspired Artistry

A professional, production-ready website for Adonai Tattoo, showcasing 21 years of faith-inspired tattoo artistry in Evansville, Indiana.

## 🚀 Live Site

**Production**: [https://adonai-tattoo.vercel.app](https://adonai-tattoo.vercel.app)

## 📋 Project Overview

This is a modern, responsive Next.js website featuring:
- **Faith-centered design** honoring Christian values
- **Professional gallery** showcasing tattoo artistry
- **Appointment booking** through messenger integration
- **SEO optimized** for local search visibility
- **Performance focused** with 85+ Lighthouse scores
- **Security hardened** with comprehensive headers

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/adonai-tattoo.git
cd adonai-tattoo

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## 📂 Project Structure

```
adonai-tattoo/
├── .github/                    # GitHub workflows and templates
│   ├── workflows/ci.yml       # CI/CD pipeline
│   └── dependabot.yml         # Dependency updates
├── public/                     # Static assets
│   ├── gallery_images/        # Tattoo portfolio images
│   ├── robots.txt             # Search engine instructions
│   ├── sitemap.xml            # Site structure for SEO
│   └── manifest.json          # PWA configuration
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── HeroSection.tsx    # Landing section
│   │   ├── GallerySection.tsx # Portfolio display
│   │   ├── LocationCTA.tsx    # Contact section
│   │   └── ...               # Other components
│   └── hooks/                 # Custom React hooks
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
├── next-sitemap.config.js     # Sitemap generation
├── vercel.json               # Deployment configuration
└── .lighthouserc.json        # Performance testing
```

## 🛠 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run type-check   # Run TypeScript checks
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Production
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Build and preview locally
npm run export       # Export static files
```

### Analysis & Testing
```bash
npm run analyze      # Bundle size analysis
npm run lighthouse   # Performance testing
npm run audit        # Security audit
npm run audit:fix    # Fix security issues
```

### Maintenance
```bash
npm run clean        # Remove build files
npm run postbuild    # Generate sitemap
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Site Configuration
SITE_URL=https://adonai-tattoo.vercel.app
NEXT_PUBLIC_ADDRESS="4606 A Covert Ave, Evansville, IN 47714"
NEXT_PUBLIC_PHONE_NUMBER="+1-812-555-0123"
NEXT_PUBLIC_MESSENGER_URL="https://m.me/steve.m.white.3"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Vercel Deployment
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-vercel-org-id
PROJECT_ID=your-vercel-project-id
```

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   Set these in Vercel dashboard:
   - `NEXT_PUBLIC_ADDRESS`
   - `NEXT_PUBLIC_PHONE_NUMBER` 
   - `NEXT_PUBLIC_MESSENGER_URL`

3. **Custom Domain**
   - Add domain in Vercel dashboard
   - Update DNS records as instructed
   - Update `SITE_URL` environment variable

### Manual Deployment

```bash
# Build the application
npm run build

# Export static files (if needed)
npm run export

# Upload .next folder to your hosting provider
```

## 🔒 Security Features

- **CSP Headers**: Content Security Policy implementation
- **HSTS**: HTTP Strict Transport Security
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **Dependency Scanning**: Automated vulnerability detection
- **Security Audits**: Regular npm audit checks

## 📊 Performance Optimization

- **Image Optimization**: WebP/AVIF formats with fallbacks
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Images and components load on demand
- **Caching**: Aggressive caching for static assets
- **Compression**: Gzip/Brotli compression enabled
- **Tree Shaking**: Remove unused code

## 🔍 SEO Features

- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Structured Data**: JSON-LD schema for local business
- **Sitemap**: Automated XML sitemap generation
- **Robots.txt**: Search engine crawling instructions
- **Canonical URLs**: Duplicate content prevention
- **Local SEO**: Optimized for Evansville, IN searches

## 🎯 Performance Targets

- **Lighthouse Performance**: 85+
- **Lighthouse Accessibility**: 90+
- **Lighthouse Best Practices**: 85+
- **Lighthouse SEO**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🧪 Testing & Quality Assurance

### Automated Testing
- **Lighthouse CI**: Performance monitoring on PRs
- **ESLint**: Code quality and consistency
- **TypeScript**: Type safety checks
- **Security Audits**: Dependency vulnerability scanning

### Manual Testing Checklist
- [ ] Responsive design on all devices
- [ ] Gallery image loading and optimization
- [ ] Contact form and messenger integration
- [ ] Google Maps functionality
- [ ] Performance on slow connections
- [ ] Accessibility compliance

## 🔧 Maintenance

### Regular Tasks
- **Weekly**: Review Dependabot PRs
- **Monthly**: Performance audit and optimization
- **Quarterly**: Security review and updates
- **Annually**: Content and imagery refresh

### Monitoring
- **Uptime**: Built-in Vercel monitoring
- **Performance**: Lighthouse CI reports
- **Errors**: Optional Sentry integration
- **Analytics**: Optional Google Analytics

## 📞 Support & Contact

For technical support or customization requests:
- **Developer**: GenUI Labs
- **Email**: support@genuilabs.com
- **Website**: [https://genuilabs.com](https://genuilabs.com)

## 📄 License

This project is proprietary software developed for Adonai Tattoo. Unauthorized reproduction or distribution is prohibited.

---

**Built with ❤️ by GenUI Labs for Adonai Tattoo**