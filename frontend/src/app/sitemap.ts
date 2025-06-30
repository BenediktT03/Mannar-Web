// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllWordClouds } from '../services/api';      // ← Ein Level hoch zu services
import { WordCloud } from '../types/wordcloud';         // ← Ein Level hoch zu types

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ben-devtest-websites.ch';
  
  try {
    // Word Cloud Daten für Sitemap laden
    const response = await getAllWordClouds();
    const wordClouds = response.data;

    // Statische Seiten
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];

    // Dynamische Seiten basierend auf Word Cloud Links
    const wordCloudPages: MetadataRoute.Sitemap = wordClouds
      .filter((word: WordCloud) => word.link_url && word.link_url.startsWith('/')) // Nur interne Links
      .map((word: WordCloud) => ({
        url: `${baseUrl}${word.link_url}`,
        lastModified: new Date(word.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: word.wichtigkeit > 7 ? 0.8 : 0.6, // Wichtigere Wörter = höhere Priorität
      }));

    return [...staticPages, ...wordCloudPages];
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