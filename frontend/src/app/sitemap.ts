// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllAngebote } from '@/services/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  
  try {
    // Alle Angebote für Sitemap laden
    const response = await getAllAngebote();
    const angebote = response.data;

    // Statische Seiten
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];

    // Dynamische Angebot-Seiten
    const angebotPages: MetadataRoute.Sitemap = angebote.map((angebot) => ({
      url: `${baseUrl}/angebot/${angebot.slug}`,        // Direkt angebot.slug
      lastModified: new Date(angebot.updatedAt),        // Direkt angebot.updatedAt
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...angebotPages];
  } catch (error) {
    console.error('Fehler beim Generieren der Sitemap:', error);
    
    // Fallback: nur statische Seiten
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}