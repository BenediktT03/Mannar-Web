// frontend/src/services/api.ts - KOMPLETTE DATEI
import axios from 'axios';
import { WordCloudsResponse, SeitenConfig } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('URL:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

// Helper function to get auth headers
const getAuthHeaders = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return {}; // Server-side: no auth headers
  }
  
  const token = localStorage.getItem('strapiToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Word Cloud API - KORRIGIERT für Strapi 5
export const getAllWordClouds = async (): Promise<WordCloudsResponse> => {
  try {
    console.log('🚀 Loading Word Clouds...');
    console.log('📍 API URL:', `${API_URL}/api/word-clouds`);
    
    const response = await api.get('/word-clouds?populate=*&sort=sortierung:asc', {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Data:', response.data);
    console.log('📊 Word Clouds loaded:', response.data.data?.length || 0);
    
    return response.data;
  } catch (error) {
    console.error('❌ Fehler beim Laden der Word Clouds:', error);
    throw error;
  }
};

export const getActiveWordClouds = async (): Promise<WordCloudsResponse> => {
  try {
    const response = await api.get('/word-clouds?populate=*&filters[istAktiv][$eq]=true&sort=sortierung:asc', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der aktiven Word Clouds:', error);
    throw error;
  }
};

// Seiten-Konfiguration API - KORRIGIERT für Strapi 5 Single Type
export const getSeitenConfig = async (): Promise<SeitenConfig> => {
  try {
    console.log('🎨 Loading Seiten Config...');
    console.log('📍 API URL:', `${API_URL}/api/seiten-config`);
    
    const response = await api.get('/seiten-config?populate=*', {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Seiten Config Response:', response.data);
    
    // Strapi 5 Single Type gibt direkt die Daten zurück (nicht in data Array)
    if (response.data && response.data.data) {
      console.log('✅ Seiten Config loaded successfully');
      return response.data.data;
    } else {
      throw new Error('Keine Seiten-Konfiguration gefunden');
    }
  } catch (error) {
    console.error('❌ Fehler beim Laden der Seiten-Konfiguration:', error);
    
    // Fallback-Konfiguration zurückgeben
    console.log('🔄 Using fallback configuration');
    return {
      id: 0,
      documentId: '',
      seitenTitel: 'Mannar - Spirituelle Begleitung',
      seitenBeschreibung: 'Peer-Begleitung und spirituelle Unterstützung',
      primaryColor: '#4f46e5',
      secondaryColor: '#10b981',
      backgroundColor: '#f9fafb',
      textColor: '#111827',
      headerColor: '#1f2937',
      footerColor: '#374151'
    };
  }
};

// CRUD Funktionen für Live Editor mit Authentication
export const createWordCloud = async (wordCloudData: any): Promise<any> => {
  try {
    console.log('🆕 Creating Word Cloud:', wordCloudData);
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Cannot create word cloud on server side');
    }
    
    const response = await api.post('/word-clouds', 
      { data: wordCloudData },
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      }
    );
    console.log('✅ Word Cloud created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Word Cloud:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

export const updateWordCloud = async (id: string, wordCloudData: any): Promise<any> => {
  try {
    console.log('📝 Updating Word Cloud:', id, wordCloudData);
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Cannot update word cloud on server side');
    }
    
    const response = await api.put(`/word-clouds/${id}`, 
      { data: wordCloudData },
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      }
    );
    console.log('✅ Word Cloud updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der Word Cloud:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

export const deleteWordCloud = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting Word Cloud:', id);
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Cannot delete word cloud on server side');
    }
    
    await api.delete(`/word-clouds/${id}`, {
      headers: getAuthHeaders()
    });
    console.log('✅ Word Cloud deleted');
  } catch (error) {
    console.error('❌ Fehler beim Löschen der Word Cloud:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

export const getWordCloudById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/word-clouds/${id}?populate=*`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Word Cloud:', error);
    throw error;
  }
};

// Seiten Config Update
export const updateSeitenConfig = async (configData: any): Promise<any> => {
  try {
    console.log('🎨 Updating Seiten Config:', configData);
    const response = await api.put('/seiten-config', 
      { data: configData },
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      }
    );
    console.log('✅ Seiten Config updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der Seiten-Konfiguration:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

// Utility Funktionen
export const getImageUrl = (imageData: any): string => {
  if (!imageData) return '';
  
  const url = imageData.url || imageData.formats?.medium?.url || imageData.formats?.small?.url;
  
  if (url?.startsWith('http')) {
    return url;
  }
  
  return `${API_URL}${url}`;
};

export const formatColor = (color: string): string => {
  if (!color) return '#333333';
  if (color.startsWith('#')) return color;
  return `#${color}`;
};

// Test API Connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/word-clouds?pagination[limit]=1`);
    return response.ok;
  } catch (error) {
    console.error('API Connection Test failed:', error);
    return false;
  }
};

// User Authentication Check
export const checkAuth = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Server-side: not authenticated
  }
  
  const token = localStorage.getItem('strapiToken');
  const user = localStorage.getItem('strapiUser');
  return !!(token && user);
};

// Clear Auth Data
export const clearAuth = (): void => {
  if (typeof window === 'undefined') {
    return; // Server-side: can't clear storage
  }
  
  localStorage.removeItem('strapiToken');
  localStorage.removeItem('strapiUser');
};