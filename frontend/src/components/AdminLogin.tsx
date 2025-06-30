'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: identifier,
          password: password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.jwt) {
        localStorage.setItem('strapiToken', data.jwt);
        localStorage.setItem('strapiUser', JSON.stringify(data.user));
        router.push('/admin');
      } else {
        setError('Login fehlgeschlagen - Überprüfe deine Daten');
      }
    } catch (err) {
      setError('Verbindungsfehler - Ist das Backend erreichbar?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Mannar Admin Login
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Benutzername
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white text-gray-900 text-lg"
              placeholder="mitarbeiter"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Passwort
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white text-gray-900 text-lg"
              placeholder="Test123!"
            />
          </div>

          {error && (
            <div className="text-red-800 text-sm text-center bg-red-100 p-3 rounded border border-red-300">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '🔄 Anmelden...' : '🔐 Anmelden'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-bold text-gray-900 mb-2">Test-Daten:</p>
          <p className="text-sm text-gray-800"><strong>Username:</strong> mitarbeiter</p>
          <p className="text-sm text-gray-800"><strong>Passwort:</strong> Test123!</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;