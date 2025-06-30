// src/app/page.tsx
// 🏠 HOMEPAGE - Word Cloud Gallery & Landing Page

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WordCloudComponent, { CompactWordCloud } from '@/components/WordCloudComponent';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';
import { useWordClouds } from '@/hooks';
import type { WordCloud } from '@/types';

// ===============================
// HERO SECTION COMPONENT
// ===============================

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Erstelle wunderschöne{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Word Clouds
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Verwandle deine Ideen in visuelle Meisterwerke. Erstelle, bearbeite und teile 
          interaktive Word Clouds mit unserem professionellen Editor.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/editor"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🎨 Jetzt erstellen
          </Link>
          
          <Link
            href="/gallery"
            className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🖼️ Galerie ansehen
          </Link>
        </div>
      </div>
    </section>
  );
};

// ===============================
// FEATURES SECTION COMPONENT
// ===============================

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🎨',
      title: 'Intuitiver Editor',
      description: 'Drag & Drop Interface mit Live-Vorschau und erweiterten Styling-Optionen.'
    },
    {
      icon: '🔗',
      title: 'Interaktive Links',
      description: 'Füge klickbare Links zu deinen Wörtern hinzu für eine bessere User Experience.'
    },
    {
      icon: '🎯',
      title: 'Präzise Kontrolle',
      description: 'Gewichtung, Farben und Positionen - du hast die volle Kontrolle über das Design.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Deine Word Clouds sehen auf allen Geräten perfekt aus - von Mobile bis Desktop.'
    },
    {
      icon: '⚡',
      title: 'Schnell & Effizient',
      description: 'Optimierte Performance für flüssige Bearbeitung auch bei großen Word Clouds.'
    },
    {
      icon: '🛡️',
      title: 'Sicher & Zuverlässig',
      description: 'Deine Daten sind bei uns sicher - mit automatischen Backups und Versionierung.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Warum unsere Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professionelle Tools für kreative Köpfe
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===============================
// WORD CLOUD GALLERY SECTION
// ===============================

const GallerySection: React.FC<{
  wordClouds: WordCloud[];
  isLoading: boolean;
}> = ({ wordClouds, isLoading }) => {
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Beliebte Word Clouds
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Beliebte Word Clouds
          </h2>
          <p className="text-xl text-gray-600">
            Entdecke kreative Beispiele aus unserer Community
          </p>
        </div>
        
        {wordClouds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Noch keine Word Clouds vorhanden
            </h3>
            <p className="text-gray-500 mb-6">
              Sei der Erste und erstelle deine eigene Word Cloud!
            </p>
            <Link
              href="/editor"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Jetzt erstellen
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {wordClouds.slice(0, 6).map((wordCloud) => (
                <Link
                  key={wordCloud.id}
                  href={`/wordcloud/${wordCloud.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="h-48 p-4">
                      <ComponentErrorBoundary componentName="Compact Word Cloud">
                        <CompactWordCloud
                          wordCloud={wordCloud}
                          maxWords={15}
                          className="h-full"
                        />
                      </ComponentErrorBoundary>
                    </div>
                    
                    <div className="p-6 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {wordCloud.title}
                      </h3>
                      {wordCloud.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {wordCloud.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <span>{wordCloud.words?.length || 0} Wörter</span>
                        <span>{new Date(wordCloud.createdAt).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center">
              <Link
                href="/gallery"
                className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                Alle Word Clouds anzeigen →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// ===============================
// CTA SECTION COMPONENT
// ===============================

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Bereit für deine erste Word Cloud?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Starte kostenlos und entdecke die unbegrenzten Möglichkeiten 
          unseres Word Cloud Editors.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/editor"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🚀 Kostenlos starten
          </Link>
          
          <Link
            href="/about"
            className="text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Mehr erfahren
          </Link>
        </div>
      </div>
    </section>
  );
};

// ===============================
// MAIN HOMEPAGE COMPONENT
// ===============================

const HomePage: React.FC = () => {
  const { wordClouds, isLoading, error } = useWordClouds();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Gallery Section */}
      <ComponentErrorBoundary componentName="Gallery Section">
        <GallerySection wordClouds={wordClouds || []} isLoading={isLoading} />
      </ComponentErrorBoundary>
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <strong>Fehler:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default HomePage;