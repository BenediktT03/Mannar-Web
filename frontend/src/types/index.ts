// src/types/index.ts

// Das ist wie ein Bauplan für deine Angebote
export interface Angebot {
  id: number;
  attributes: {
    titel: string;
    slug: string;
    preis: number;
    beschreibung: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Strapi gibt uns die Daten immer so zurück
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Für mehrere Angebote
export type AngeboteResponse = StrapiResponse<Angebot[]>;

// Für ein einzelnes Angebot
export type AngebotResponse = StrapiResponse<Angebot>;