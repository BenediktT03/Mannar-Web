// src/services/api.ts
import axios from 'axios';

// Word Cloud Interfaces direkt hier definieren
export interface WordCloud {
  id: number;
  documentId: string;
  wort: string;
  wichtigkeit: number;
  link_url?: string;
  beschreibung?: unknown;
  farbe?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface WordCloudResponse {
  data: WordCloud[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Die URL zu deiner Strapi-API
const API_URL = 'http://localhost:1337';

// Axios-Instance erstellen
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Word Cloud API Calls
export const getAllWordClouds = async (): Promise<WordCloudResponse> => {
  try {
    console.log('Loading Word Clouds...');
    console.log('API URL:', `${API_URL}/api/word-clouds`);
    const response = await api.get('/word-clouds');
    console.log('Word Clouds loaded:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Word Cloud:', error);
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('URL:', error.config?.url);
    }
    throw error;
  }
};