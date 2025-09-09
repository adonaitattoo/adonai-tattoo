# 🚀 Deployment Guide - Adonai Tattoo

This guide provides step-by-step instructions for deploying the Adonai Tattoo website to production.

## 🎯 Pre-Deployment Checklist

### 1. Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript checks passing (`npm run type-check`)
- [ ] Build successful (`npm run build`)
- [ ] Performance targets met (`npm run lighthouse`)

### 2. Content Verification
- [ ] All images optimized and compressed
- [ ] Contact information accurate
- [ ] Gallery images properly sized
- [ ] Social media links updated
- [ ] Meta descriptions and titles reviewed

### 3. Security Review
- [ ] No high/critical vulnerabilities (`npm audit`)
- [ ] Environment variables secured
- [ ] API keys rotated if needed
- [ ] Security headers configured

## 🌐 Vercel Deployment (Primary)

### Initial Setup

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

### Environment Configuration

Set these environment variables in Vercel dashboard:

**Required Variables:**
```env
NEXT_PUBLIC_ADDRESS="4606 A Covert Ave, Evansville, IN 47714"
NEXT_PUBLIC_PHONE_NUMBER="+1-812-555-0123"
NEXT_PUBLIC_MESSENGER_URL="https://m.me/adonaitattoo"
SITE_URL="https://adonai-tattoo.vercel.app"
```

**Optional Variables:**
```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_SENTRY_DSN="https://..."
VERCEL_TOKEN="your-token"
ORG_ID="your-org-id"
PROJECT_ID="your-project-id"
```

### Deploy to Production

```bash
# Deploy to production
vercel --prod

# Or via Git (automatic)
git push origin main
```

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain

2. **Configure DNS**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

3. **Update Environment Variables**
   ```env
   SITE_URL="https://yourdomain.com"
   ```

## 🏗️ Alternative Hosting Platforms

### Netlify Deployment

1. **Build Settings**
   ```
   Build command: npm run build && npm run export
   Publish directory: out
   ```

2. **netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
   ```

### AWS S3 + CloudFront

1. **Build and Export**
   ```bash
   npm run build
   npm run export
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync out/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Origin: S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Custom Error Pages: 404 → /404.html

## 🔧 CI/CD Pipeline

### GitHub Actions (Automated)

The CI/CD pipeline automatically:
- Runs tests and security scans
- Builds the application
- Deploys to Vercel on main branch
- Runs Lighthouse performance tests

### Manual Deployment

```bash
# Production deployment checklist
npm run clean           # Clean previous builds
npm run type-check      # Verify TypeScript
npm run lint           # Check code quality
npm run build          # Build for production
npm run preview        # Test locally
npm run lighthouse     # Performance check
vercel --prod          # Deploy to production
```

## 📊 Post-Deployment Verification

### 1. Functional Testing
- [ ] Homepage loads correctly
- [ ] Navigation works properly
- [ ] Gallery images display
- [ ] Contact forms functional
- [ ] Google Maps integration working
- [ ] Mobile responsiveness

### 2. Performance Testing
```bash
# Run Lighthouse audit
npm run lighthouse

# Check Core Web Vitals
# - LCP < 2.5s
# - FID < 100ms
# - CLS < 0.1
```

### 3. SEO Verification
- [ ] Search Console verification
- [ ] Sitemap submitted
- [ ] Meta tags correct
- [ ] Structured data valid
- [ ] Social media previews

### 4. Security Verification
```bash
# Security headers check
curl -I https://your-domain.com

# SSL certificate verification
openssl s_client -connect your-domain.com:443
```

## 🔄 Rollback Procedures

### Vercel Rollback
```bash
# List deployments
vercel list

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Manual Rollback
```bash
# Revert to last known good commit
git revert HEAD
git push origin main
```

## 📈 Monitoring & Maintenance

### Performance Monitoring
- **Vercel Analytics**: Built-in monitoring
- **Google PageSpeed**: Weekly manual checks
- **Lighthouse CI**: Automated on PRs

### Uptime Monitoring
- **Vercel**: Built-in uptime monitoring
- **UptimeRobot**: External monitoring service
- **StatusPage**: Public status updates

### Error Tracking
```javascript
// Optional Sentry configuration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variable Issues**
```bash
# Verify variables are set
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME
```

**Domain Issues**
```bash
# Check DNS propagation
nslookup your-domain.com

# Verify SSL certificate
curl -I https://your-domain.com
```

### Support Contacts

**Technical Issues:**
- Developer: GenUI Labs
- Email: support@genuilabs.com
- Emergency: [Contact details]

**Hosting Issues:**
- Vercel Support: [vercel.com/support]
- DNS Provider: [Your DNS provider]

## 📋 Deployment Schedule

### Recommended Schedule
- **Major Updates**: Monthly (2nd Tuesday)
- **Security Updates**: As needed (emergency)
- **Content Updates**: Weekly (Fridays)
- **Performance Reviews**: Quarterly

### Maintenance Windows
- **Preferred**: Sundays 2:00 AM - 4:00 AM EST
- **Emergency**: Anytime with 1-hour notice
- **Major Changes**: 48-hour advance notice

---

**Last Updated**: January 2024  
**Next Review**: April 2024
