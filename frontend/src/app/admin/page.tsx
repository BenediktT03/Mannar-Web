 
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('strapiToken');
    const user = localStorage.getItem('strapiUser');

    console.log('🔍 Checking auth:', { token: !!token, user: !!user });

    if (token && user) {
      console.log('✅ User authenticated');
      setIsAuthenticated(true);
    } else {
      console.log('❌ User not authenticated, redirecting to login');
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Lade...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Nicht angemeldet</div>
          <p className="text-gray-600">Du wirst zum Login weitergeleitet...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}