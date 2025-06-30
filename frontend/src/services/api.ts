// src/services/api.ts
import axios from 'axios';
import { AngeboteResponse, AngebotResponse } from '@/types';

// Die URL zu deiner Strapi-API
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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
    const response = await api.get('/angebote');
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Angebote:', error);
    throw error;
  }
};

// Ein einzelnes Angebot holen
export const getAngebotBySlug = async (slug: string): Promise<AngebotResponse> => {
  try {
    const response = await api.get(`/angebote?filters[slug][$eq]=${slug}`);
    if (response.data.data.length === 0) {
      throw new Error('Angebot nicht gefunden');
    }
    return {
      data: response.data.data[0],
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Fehler beim Laden des Angebots:', error);
    throw error;
  }
};  