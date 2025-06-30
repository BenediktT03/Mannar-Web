import React from 'react';
import Link from 'next/link';
import { getAllWordClouds, getSeitenConfig } from '@/services/api';
import WordCloudComponent from '@/components/WordCloudComponent';
import DynamicStyles from '@/components/DynamicStyles';

export default async function Home() {
  try {
    const [wordCloudsResponse, seitenConfig] = await Promise.all([
      getAllWordClouds(),
      getSeitenConfig()
    ]);

    const wordClouds = wordCloudsResponse.data || [];

    return (
      <>
        <DynamicStyles config={seitenConfig} />
        
        <div 
          className="min-h-screen" 
          style={{ backgroundColor: seitenConfig.backgroundColor }}
        >
          {/* Header */}
          <header 
            className="py-8" 
            style={{ backgroundColor: seitenConfig.headerColor || seitenConfig.primaryColor }}
          >
            <div className="container mx-auto px-4 text-center">
              <h1 
                className="text-4xl font-bold"
                style={{ color: '#ffffff' }}
              >
                TEST - MANNAR WEBSITE - TEST
              </h1>
              <p 
                className="mt-2 text-lg"
                style={{ color: '#ffffff' }}
              >
                {seitenConfig.seitenBeschreibung || 'Peer-Begleitung und spirituelle Unterstützung'}
              </p>
              
              {/* LOGIN BUTTON */}
              <div className="flex justify-center mt-4">
                <Link 
                  href="/login"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold"
                >
                  🔐 LOGIN BUTTON
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {wordClouds.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 
                    className="text-3xl font-bold mb-4"
                    style={{ color: seitenConfig.textColor || '#111827' }}
                  >
                    Spirituelle Themen
                  </h2>
                  <p 
                    className="text-lg"
                    style={{ color: seitenConfig.textColor || '#111827' }}
                  >
                    Entdecke verschiedene Bereiche der spirituellen Begleitung
                  </p>
                </div>

                {wordClouds.map((wordCloud) => (
                  <WordCloudComponent key={wordCloud.id} wordCloud={wordCloud} />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: seitenConfig.textColor || '#111827' }}
                >
                  Noch keine Word Clouds verfügbar
                </h2>
                <p style={{ color: seitenConfig.textColor || '#111827' }}>
                  Erstelle deine erste Word Cloud im Strapi Admin Panel.
                </p>
                <div className="mt-6">
                  <Link 
                    href="/login"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Zum Admin Login →
                  </Link>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer 
            className="py-8 mt-12"
            style={{ backgroundColor: seitenConfig.footerColor || seitenConfig.headerColor || seitenConfig.primaryColor }}
          >
            <div className="container mx-auto px-4 text-center">
              <p style={{ color: '#ffffff' }}>
                © 2025 {seitenConfig.seitenTitel}. Alle Rechte vorbehalten.
              </p>
              {seitenConfig.kontaktEmail && (
                <p className="mt-2">
                  <a 
                    href={`mailto:${seitenConfig.kontaktEmail}`}
                    style={{ color: seitenConfig.secondaryColor || '#10b981' }}
                    className="hover:underline"
                  >
                    {seitenConfig.kontaktEmail}
                  </a>
                </p>
              )}
            </div>
          </footer>
        </div>
      </>
    );
  } catch (error) {
    console.error('Fehler beim Laden der Seite:', error);
    
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Fehler beim Laden
          </h1>
          <p className="text-gray-600 mb-6">
            Bitte überprüfe, ob das Strapi Backend läuft.
          </p>
          <Link 
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Zum Admin Login
          </Link>
        </div>
      </div>
    );
  }
}