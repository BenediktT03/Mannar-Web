// src/types/index.ts

// Strapi 5 Struktur - Felder sind direkt im Objekt!
export interface Angebot {
  id: number;
  documentId: string;  // Neu in Strapi 5
  titel: string;       // Deutsche Feldnamen, direkt im Objekt
  slug: string;
  preis: number;
  beschreibung?: any;  // Rich Text kann komplex sein, erstmal any
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Strapi Meta-Informationen
export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Für mehrere Angebote
export interface AngeboteResponse {
  data: Angebot[];
  meta: StrapiMeta;
}

// Für ein einzelnes Angebot
export interface AngebotResponse {
  data: Angebot;
  meta: StrapiMeta;
}