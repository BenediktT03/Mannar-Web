 export interface WordCloudWort {
  id?: number;
  text: string;
  gewichtung: number; // 1-10 (bestimmt Schriftgröße)
  link?: string;
  farbe?: string;
  istExternerLink?: boolean;
  beschreibung?: string;
}

export interface WordCloud {
  id: number;
  documentId: string;
  titel: string;
  beschreibung?: string;
  istAktiv: boolean;
  sortierung: number;
  woerter: WordCloudWort[];
  hintergrundfarbe: string;
  textfarbe: string;
  hoverfarbe: string;
  maxBreite: number;
  maxHoehe: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface WordCloudsResponse {
  data: WordCloud[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SeitenConfig {
  id: number;
  documentId: string;
  seitenTitel: string;
  seitenBeschreibung?: string;
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor: string;
  textColor?: string;
  headerColor?: string;
  footerColor?: string;
  kontaktEmail?: string;
  telefon?: string;
  adresse?: string;
  customCSS?: string;
  // Strapi Meta-Felder optional
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
