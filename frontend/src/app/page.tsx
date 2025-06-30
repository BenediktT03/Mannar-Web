// src/app/page.tsx
import { getAllWordClouds, WordCloud as WordCloudType } from '../services/api';
import WordCloud, { WordCloudSkeleton } from '../components/WordCloud'; // ← components ist parallel zu app
import { Suspense } from 'react';

// Word Cloud Daten laden
async function getWordCloudData() {
  try {
    const response = await getAllWordClouds();
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Word Cloud:', error);
    return [];
  }
}

export default async function Home() {
  const wordCloudData = await getWordCloudData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Mannar
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Genesungsbegleitung & Spirituelle Unterstützung
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Begleitung auf deinem persönlichen Weg der Heilung und des Wachstums. 
            Entdecke die verschiedenen Bereiche meiner Arbeit.
          </p>
        </div>
        
        {/* Word Cloud Sektion */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Meine Themenwelten
          </h2>
          
          {wordCloudData.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p className="text-xl mb-4">🌱 Themenwelten werden geladen...</p>
              <p className="text-sm">
                Stelle sicher, dass du Word Cloud Einträge in Strapi erstellt hast.
              </p>
            </div>
          ) : (
            <Suspense fallback={<WordCloudSkeleton />}>
              <WordCloud words={wordCloudData} />
            </Suspense>
          )}
        </section>

        {/* Über Mannar Sektion */}
        <section className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Über meine Arbeit
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Als Peer/Genesungsbegleiter unterstütze ich Menschen auf ihrem individuellen 
            Weg der Heilung und persönlichen Entwicklung. Meine Arbeit verbindet 
            praktische Begleitung mit spirituellen Ansätzen.
          </p>
          <div className="mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
              Kontakt aufnehmen
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}