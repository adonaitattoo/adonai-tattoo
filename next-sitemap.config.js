/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://adonai-tattoo.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot', 
        allow: '/',
        crawlDelay: 0,
      },
    ],
    additionalSitemaps: [
      'https://adonai-tattoo.vercel.app/sitemap.xml',
    ],
  },
  transform: async (_unused, path) => {
    void _unused;
    // Customize sitemap entries
    const defaultTransform = {
      loc: path,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }

    // Homepage gets highest priority
    if (path === '/') {
      return {
        ...defaultTransform,
        priority: 1.0,
        changefreq: 'weekly',
      }
    }

    // Gallery section gets high priority
    if (path.includes('gallery')) {
      return {
        ...defaultTransform,
        priority: 0.9,
        changefreq: 'weekly',
      }
    }

    // Other sections get standard priority
    return defaultTransform
  },
  exclude: [
    '/api/*',
    '/_next/*',
    '/admin/*',
    '*.json',
    '*.txt',
  ],
  additionalPaths: async () => [
    {
      loc: '/#values',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/#about', 
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/#gallery',
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/#visit',
      changefreq: 'monthly', 
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
  ],
}
