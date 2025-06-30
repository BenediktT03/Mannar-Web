// src/app/page.tsx
import { getAllAngebote } from '@/services/api';
import Link from 'next/link';

export default async function HomePage() {
  try {
    const response = await getAllAngebote();
    const angebote = response.data || [];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Willkommen bei Mannar
          </h1>
          
          <div className="mb-8">
            <Link 
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔐 Admin Login
            </Link>
          </div>

          {angebote.length > 0 && (
            <div className="grid gap-6">
              <h2 className="text-2xl font-semibold text-gray-800">Unsere Angebote</h2>
              {angebote.map((angebot: any) => (
                <div key={angebot.id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{angebot.titel}</h3>
                  <p className="text-gray-600">{angebot.beschreibung}</p>
                  {angebot.preis && (
                    <p className="text-lg font-bold text-blue-600 mt-4">
                      {angebot.preis.toFixed(2)} CHF
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Willkommen bei Mannar
          </h1>
          <p className="text-gray-600 mb-8">Spirituelle Begleitung und Word Clouds</p>
          <Link 
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔐 Admin Login
          </Link>
        </div>
      </div>
    );
  }
}