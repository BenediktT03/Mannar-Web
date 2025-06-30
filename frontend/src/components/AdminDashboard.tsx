// frontend/src/components/AdminDashboard.tsx - UPDATED VERSION
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LiveWordCloudEditor from './LiveWordCloudEditor';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showLiveEditor, setShowLiveEditor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('strapiUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('strapiToken');
    localStorage.removeItem('strapiUser');
    router.push('/');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-gray-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">
                  Mannar Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  Willkommen, {user?.username || 'Admin'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Ausloggen
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Admin Dashboard
            </h2>
            
            {/* FEATURED: Live Editor */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">
                🚀 Live Word Cloud Editor
              </h3>
              <p className="text-purple-800 mb-4">
                Erstelle und bearbeite Word Clouds mit Live-Vorschau und professionellen Tools
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLiveEditor(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  ✨ Live Editor öffnen
                </button>
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  👁️ Website anzeigen
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strapi Admin */}
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  ⚙️ Strapi Admin
                </h3>
                <p className="text-blue-800 mb-4">
                  Vollzugriff auf alle Inhalte und erweiterte Einstellungen
                </p>
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Strapi öffnen
                </button>
              </div>

              {/* Word Clouds Classic */}
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  📝 Word Clouds (Classic)
                </h3>
                <p className="text-green-800 mb-4">
                  Traditionelle Verwaltung über Strapi Interface
                </p>
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin/content-manager/collection-types/api::word-cloud.word-cloud`, '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Classic Editor
                </button>
              </div>

              {/* Website Design */}
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                  🎨 Website Design
                </h3>
                <p className="text-orange-800 mb-4">
                  Ändere globale Farben und Design-Einstellungen
                </p>
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin/content-manager/single-types/api::seiten-config.seiten-config`, '_blank')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Design anpassen
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Schnellzugriff
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowLiveEditor(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  🎨 Neue Word Cloud
                </button>
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin/content-manager/collection-types/api::word-cloud.word-cloud`, '_blank')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  📋 Alle Word Clouds
                </button>
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_STRAPI_URL}/admin/content-manager/single-types/api::seiten-config.seiten-config`, '_blank')}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  🌈 Farben ändern
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 System Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">✅</div>
                  <div className="text-sm text-gray-600">Frontend Online</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">✅</div>
                  <div className="text-sm text-gray-600">Backend Online</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">🔐</div>
                  <div className="text-sm text-gray-600">Angemeldet</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">🚀</div>
                  <div className="text-sm text-gray-600">Live Editor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Word Cloud Editor Modal */}
      {showLiveEditor && (
        <LiveWordCloudEditor onClose={() => setShowLiveEditor(false)} />
      )}
    </>
  );
};

export default AdminDashboard;