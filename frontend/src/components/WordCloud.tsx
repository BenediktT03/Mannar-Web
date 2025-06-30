// src/components/WordCloud.tsx
import { WordCloud as WordCloudType } from '../services/api';
import Link from 'next/link';

interface WordCloudProps {
  words: WordCloudType[];
}

export default function WordCloud({ words }: WordCloudProps) {
  // Sortiere Wörter nach Wichtigkeit (größte zuerst)
  const sortedWords = [...words].sort((a, b) => b.wichtigkeit - a.wichtigkeit);

  // Berechne Schriftgröße basierend auf Wichtigkeit (1-10 → 12px-48px)
  const getFontSize = (wichtigkeit: number) => {
    const minSize = 14; // Minimum 14px
    const maxSize = 48; // Maximum 48px
    const size = ((wichtigkeit - 1) / 9) * (maxSize - minSize) + minSize;
    return Math.round(size);
  };

  // Berechne Transparenz für mehr Tiefe
  const getOpacity = (wichtigkeit: number) => {
    return 0.6 + (wichtigkeit / 10) * 0.4; // 0.6 bis 1.0
  };

  return (
    <div className="word-cloud-container bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg">
      <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
        {sortedWords.map((word, index) => {
          const fontSize = getFontSize(word.wichtigkeit);
          const opacity = getOpacity(word.wichtigkeit);
          const color = word.farbe || '#3b82f6';

          const WordElement = (
            <span
              className="word-item inline-block px-3 py-1 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md cursor-pointer"
              style={{
                fontSize: `${fontSize}px`,
                color: color,
                opacity: opacity,
                fontWeight: word.wichtigkeit > 7 ? 'bold' : word.wichtigkeit > 4 ? '600' : '500',
                backgroundColor: `${color}10`, // Leichter Hintergrund
                border: `2px solid ${color}20`,
              }}
              key={word.id}
              title={word.beschreibung ? String(word.beschreibung) : word.wort}
            >
              {word.wort}
            </span>
          );

          // Wenn Link vorhanden, wrappen in Link-Component
          if (word.link_url) {
            return (
              <Link
                key={word.id}
                href={word.link_url}
                className="hover:no-underline"
              >
                {WordElement}
              </Link>
            );
          }

          // Sonst nur das Word-Element returnen
          return WordElement;
        })}
      </div>

      {/* Info-Text */}
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>✨ Klicke auf die Wörter um mehr zu erfahren ✨</p>
      </div>
    </div>
  );
}

// Loading-Skeleton für Word Cloud
export function WordCloudSkeleton() {
  return (
    <div className="word-cloud-container bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg animate-pulse">
      <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
        {/* Skeleton Words */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-8 bg-gray-300 rounded-lg"
            style={{
              width: `${80 + Math.random() * 120}px`, // Zufällige Breiten
            }}
          />
        ))}
      </div>
      <div className="mt-6 h-4 bg-gray-300 rounded mx-auto w-64" />
    </div>
  );
}