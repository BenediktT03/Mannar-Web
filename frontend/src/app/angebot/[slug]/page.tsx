// src/app/angebot/[slug]/page.tsx
import { getAngebotBySlug, getAllAngebote } from '@/services/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// TypeScript: Das sagt, welche Parameter diese Seite bekommt
interface PageProps {
  params: {
    slug: string;
  };
}

// Diese Funktion sagt Next.js, welche Seiten es vorab erstellen soll
export async function generateStaticParams() {
  try {
    const response = await getAllAngebote();
    
    return response.data.map((angebot) => ({
      slug: angebot.attributes.slug,
    }));
  } catch (error) {
    console.error('Fehler beim Generieren der Static Params:', error);
    return [];
  }
}

// Die Hauptfunktion der Seite
export default async function AngebotPage({ params }: PageProps) {
  try {
    const response = await getAngebotBySlug(params.slug);
    const angebot = response.data;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Zurück-Button */}
          <Link 
            href="/"
            className="inline-block mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Zurück zu den Angeboten
          </Link>

          {/* Angebot Details */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {angebot.attributes.titel}
            </h1>
            
            <div className="text-3xl font-bold text-blue-600 mb-6">
              {angebot.attributes.preis.toFixed(2)} CHF
            </div>
            
            <div className="prose max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: angebot.attributes.beschreibung 
                }}
              />
            </div>
            
            {/* Call-to-Action */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                Jetzt bestellen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Wenn das Angebot nicht gefunden wird
    notFound();
  }
}

// ISR (Incremental Static Regeneration) - Seite wird alle 60 Sekunden neu generiert
export const revalidate = 60;