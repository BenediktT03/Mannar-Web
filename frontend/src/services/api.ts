// src/services/api.ts
import axios from 'axios';
import { AngeboteResponse, AngebotResponse } from '@/types';

// Die URL zu deiner Strapi-API
const API_URL = 'https://mannar-web.onrender.com'; // Direkt hardcoded

// Axios-Instance erstellen (wie ein vorkonfiguriertes Werkzeug)
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fehlerbehandlung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Alle Angebote holen
export const getAllAngebote = async (): Promise<AngeboteResponse> => {
  try {
    console.log('API_URL:', API_URL);
    console.log('Calling:', `${API_URL}/api/angebots`);
    const response = await api.get('/angebots'); // ← Jetzt richtig: angebots statt angebote
    console.log('Response:', response.data);
    console.log('First item:', response.data.data[0]); // ← Neue Zeile zum Debuggen
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Angebote:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
    }
    throw error;
  }
};

// Ein einzelnes Angebot holen
export const getAngebotBySlug = async (slug: string): Promise<AngebotResponse> => {
  try {
    const response = await api.get(`/angebots?filters[slug][$eq]=${slug}`); // ← Auch hier: angebots
    if (response.data.data.length === 0) {
      throw new Error('Angebot nicht gefunden');
    }
    return {
      data: response.data.data[0],
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Fehler beim Laden des Angebots:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    }
    throw error;
  }
};