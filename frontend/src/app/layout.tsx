// src/app/layout.tsx
// 🌐 ROOT LAYOUT - Next.js App Router

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// ===============================
// FONT CONFIGURATION
// ===============================

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===============================
// METADATA CONFIGURATION
// ===============================

export const metadata: Metadata = {
  title: {
    default: 'WordClouds - Professionelle Word Cloud Platform',
    template: '%s | WordClouds',
  },
  description: 'Erstelle wunderschöne, interaktive Word Clouds mit unserem professionellen Editor. Einfach, schnell und kostenlos.',
  keywords: [
    'Word Cloud',
    'Wortwolke',
    'Text Visualisierung',
    'Design Tool',
    'Online Editor',
    'Interaktiv',
    'Kostenlos'
  ],
  authors: [{ name: 'WordClouds Team' }],
  creator: 'WordClouds',
  publisher: 'WordClouds',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'WordClouds - Professionelle Word Cloud Platform',
    description: 'Erstelle wunderschöne, interaktive Word Clouds mit unserem professionellen Editor.',
    url: '/',
    siteName: 'WordClouds',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WordClouds Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordClouds - Professionelle Word Cloud Platform',
    description: 'Erstelle wunderschöne, interaktive Word Clouds mit unserem professionellen Editor.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// ===============================
// VIEWPORT CONFIGURATION
// ===============================

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// ===============================
// ROOT LAYOUT COMPONENT
// ===============================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Performance hints */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Analytics (Google Analytics, etc.) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
        suppressHydrationWarning={true}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50"
        >
          Zum Hauptinhalt springen
        </a>
        
        {/* Main Application - Simple Layout */}
        <div className="min-h-screen">
          <div id="main-content">
            {children}
          </div>
        </div>
        
        {/* Portal root for modals, tooltips, etc. */}
        <div id="modal-root" />
        <div id="tooltip-root" />
        
        {/* Service Worker Registration */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
} 