// frontend/src/types/wordcloud.ts

// Strapi 5 Word Cloud Interface
export interface WordCloud {
  id: number;
  documentId: string;
  wort: string;
  wichtigkeit: number; // 1-10
  link_url?: string;
  beschreibung?: unknown; // Rich Text
  farbe?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// API Response Types
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