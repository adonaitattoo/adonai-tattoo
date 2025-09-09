import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, WebVitals } from "@/components/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adonai Tattoo - Faith-Inspired Art | Evansville, IN",
  description: "Experience 21 years of faith-inspired tattoo artistry at Adonai Tattoo. Creating meaningful art that honors God and tells your unique story in Evansville, IN.",
  keywords: [
    "tattoo",
    "Christian tattoo", 
    "faith-inspired art",
    "Evansville tattoo",
    "religious tattoo",
    "custom tattoo",
    "biblical tattoos",
    "spiritual art",
    "Indiana tattoo artist",
    "appointment only tattoo"
  ],
  authors: [{ name: "Adonai Tattoo", url: "https://adonai-tattoo.vercel.app" }],
  creator: "Adonai Tattoo",
  publisher: "Adonai Tattoo",
  category: "Art & Design",
  
  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adonai-tattoo.vercel.app",
    siteName: "Adonai Tattoo",
    title: "Adonai Tattoo - Faith-Inspired Art | Evansville, IN",
    description: "Experience 21 years of faith-inspired tattoo artistry at Adonai Tattoo. Creating meaningful art that honors God and tells your unique story in Evansville, IN.",
    images: [
      {
        url: "https://adonai-tattoo.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Adonai Tattoo - Faith-Inspired Artistry",
      },
      {
        url: "https://adonai-tattoo.vercel.app/AdonaiTattooLogo.png",
        width: 400,
        height: 400,
        alt: "Adonai Tattoo Logo",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Adonai Tattoo - Faith-Inspired Art | Evansville, IN",
    description: "Experience 21 years of faith-inspired tattoo artistry at Adonai Tattoo. Creating meaningful art that honors God and tells your unique story in Evansville, IN.",
    images: ["https://adonai-tattoo.vercel.app/og-image.jpg"],
    creator: "@adonaitattoo",
    site: "@adonaitattoo",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification codes (add these when you get them)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  //   yahoo: "your-yahoo-verification-code",
  // },

  // Canonical URL
  alternates: {
    canonical: "https://adonai-tattoo.vercel.app",
  },

  // Favicons and app icons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72" },
      { url: "/apple-touch-icon-114x114.png", sizes: "114x114" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144" },
    ],
    other: [
      { rel: "icon", url: "/favicon.ico" },
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#dc2626" },
    ],
  },

  // Web app manifest
  manifest: "/manifest.json",

  // Additional meta tags
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Adonai Tattoo",
    "application-name": "Adonai Tattoo",
    "msapplication-TileColor": "#dc2626",
    "msapplication-TileImage": "/mstile-144x144.png",
    "theme-color": "#dc2626",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://adonai-tattoo.vercel.app/#business",
    "name": "Adonai Tattoo",
    "alternateName": "Adonai Tattoo Studio",
    "description": "Faith-inspired tattoo artistry with 21 years of experience, creating meaningful art that honors God and tells your unique story.",
    "url": "https://adonai-tattoo.vercel.app",
    "telephone": "+1-812-555-0123",
    "email": "info@adonaitattoo.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4606 A Covert Ave",
      "addressLocality": "Evansville",
      "addressRegion": "IN",
      "postalCode": "47714",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "37.9755",
      "longitude": "-87.5311"
    },
    "openingHours": "Mo-Fr 09:00-17:00",
    "serviceArea": {
      "@type": "City",
      "name": "Evansville, IN"
    },
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card",
    "currenciesAccepted": "USD",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Tattoo Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Tattoo Design",
            "description": "Faith-inspired custom tattoo designs"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Religious Tattoos",
            "description": "Biblical and Christian themed tattoos"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultation",
            "description": "Tattoo design consultation and planning"
          }
        }
      ]
    },
    "image": [
      "https://adonai-tattoo.vercel.app/AdonaiTattooLogo.png",
      "https://adonai-tattoo.vercel.app/adonai_tattoo_shop.jpg",
      "https://adonai-tattoo.vercel.app/og-image.jpg"
    ],
    "logo": "https://adonai-tattoo.vercel.app/AdonaiTattooLogo.png",
    "sameAs": [
      "https://www.facebook.com/adonaitattoo",
      "https://www.instagram.com/adonaitattoo"
    ],
    "foundingDate": "2003",
    "slogan": "Where Faith Meets Artistry",
    "knowsAbout": [
      "Christian Tattoos",
      "Religious Art",
      "Custom Tattoo Design", 
      "Biblical Imagery",
      "Faith-based Art"
    ],
    "hasCredential": "21 years of professional tattoo experience"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics />
        <WebVitals />
      </body>
    </html>
  );
}
