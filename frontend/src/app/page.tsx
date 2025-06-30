// src/app/page.tsx
import { getAllAngebote } from '@/services/api';
import { Angebot } from '@/types';
import Link from 'next/link';

// Diese Funktion lädt die Daten VOR dem Rendern der Seite
async function getAngebote() {
  try {
    const response = await getAllAngebote();
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Angebote:', error);
    return [];
  }
}

export default async function Home() {
  const angebote = await getAngebote();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Unsere Angebote
        </h1>
        
        {angebote.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Keine Angebote verfügbar.</p>
            <p className="text-sm mt-2">
              Stelle sicher, dass Strapi läuft und Testdaten existieren.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {angebote.map((angebot: Angebot) => (
              <div 
                key={angebot.id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {angebot.attributes.titel}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {angebot.attributes.beschreibung}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {angebot.attributes.preis.toFixed(2)} CHF
                  </span>
                  <Link 
                    href={`/angebot/${angebot.attributes.slug}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}