// src/components/MainLayout.tsx
// 🏗️ MAIN LAYOUT - Navigation, Header & Footer (Renamed to avoid case conflicts)

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';

// ===============================
// NAVIGATION COMPONENT
// ===============================

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/gallery', label: 'Galerie', icon: '🖼️' },
    { href: '/editor', label: 'Editor', icon: '🎨' },
    { href: '/about', label: 'Über uns', icon: 'ℹ️' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span className="text-2xl">☁️</span>
            <span>WordClouds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.username}</span>
                    <span className="text-gray-400">▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        👤 Profil
                      </Link>
                      <Link
                        href="/my-wordclouds"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        ☁️ Meine Word Clouds
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        ⚙️ Einstellungen
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Abmelden
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <hr className="my-4" />
              
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-blue-600 font-medium"
                  >
                    <span>📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-3 text-red-600 font-medium w-full text-left"
                  >
                    <span>🚪</span>
                    <span>Abmelden</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 font-medium"
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-medium text-center"
                  >
                    Registrieren
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ===============================
// FOOTER COMPONENT
// ===============================

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { href: '/editor', label: 'Word Cloud Editor' },
        { href: '/gallery', label: 'Galerie' },
        { href: '/templates', label: 'Vorlagen' },
        { href: '/pricing', label: 'Preise' },
      ]
    },
    {
      title: 'Unternehmen',
      links: [
        { href: '/about', label: 'Über uns' },
        { href: '/contact', label: 'Kontakt' },
        { href: '/careers', label: 'Karriere' },
        { href: '/blog', label: 'Blog' },
      ]
    },
    {
      title: 'Support',
      links: [
        { href: '/help', label: 'Hilfe & FAQ' },
        { href: '/documentation', label: 'Dokumentation' },
        { href: '/tutorials', label: 'Tutorials' },
        { href: '/community', label: 'Community' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Datenschutz' },
        { href: '/terms', label: 'AGB' },
        { href: '/imprint', label: 'Impressum' },
        { href: '/cookies', label: 'Cookie-Richtlinie' },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold mb-4">
              <span className="text-2xl">☁️</span>
              <span>WordClouds</span>
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Die professionelle Platform für wunderschöne, interaktive Word Clouds.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                🐙
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📸
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">📧 Newsletter abonnieren</h3>
              <p className="text-gray-400">
                Bleib auf dem Laufenden über neue Features und Updates.
              </p>
            </div>
            
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Deine E-Mail-Adresse"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors font-medium">
                Abonnieren
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
            <p>© {currentYear} WordClouds. Alle Rechte vorbehalten.</p>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span>Gemacht mit ❤️ in Deutschland</span>
              <div className="flex items-center space-x-2">
                <span>Powered by</span>
                <Link href="https://nextjs.org" className="hover:text-white transition-colors">
                  Next.js
                </Link>
                <span>&</span>
                <Link href="https://strapi.io" className="hover:text-white transition-colors">
                  Strapi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ===============================
// MAIN LAYOUT COMPONENT
// ===============================

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className={`flex-1 pt-16 ${className}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;