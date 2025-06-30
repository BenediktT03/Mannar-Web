 'use client';

import React from 'react';
import Link from 'next/link';
import { WordCloud, WordCloudWort } from '@/types';

interface WordCloudComponentProps {
  wordCloud: WordCloud;
}

const WordCloudComponent: React.FC<WordCloudComponentProps> = ({ wordCloud }) => {
  const getWordSize = (gewichtung: number): string => {
    const baseSize = 16;
    const size = baseSize + (gewichtung * 4); // 20px bis 56px
    return `${size}px`;
  };

  const getWordStyle = (wort: WordCloudWort) => ({
    fontSize: getWordSize(wort.gewichtung),
    color: wort.farbe !== 'inherit' ? wort.farbe : wordCloud.textfarbe,
    margin: '0.5rem',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    textDecoration: wort.link ? 'none' : 'none',
    cursor: wort.link ? 'pointer' : 'default',
  });

  const renderWort = (wort: WordCloudWort, index: number) => {
    if (wort.link) {
      if (wort.istExternerLink) {
        return (
          <a
            key={index}
            href={wort.link}
            target="_blank"
            rel="noopener noreferrer"
            style={getWordStyle(wort)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = wordCloud.hoverfarbe;
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = wort.farbe !== 'inherit' ? wort.farbe! : wordCloud.textfarbe;
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={wort.beschreibung}
          >
            {wort.text}
          </a>
        );
      } else {
        return (
          <Link
            key={index}
            href={wort.link}
            style={getWordStyle(wort)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = wordCloud.hoverfarbe;
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = wort.farbe !== 'inherit' ? wort.farbe! : wordCloud.textfarbe;
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={wort.beschreibung}
          >
            {wort.text}
          </Link>
        );
      }
    }

    return (
      <span
        key={index}
        style={getWordStyle(wort)}
        title={wort.beschreibung}
      >
        {wort.text}
      </span>
    );
  };

  return (
    <div className="word-cloud-container mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{wordCloud.titel}</h2>
      {wordCloud.beschreibung && (
        <p className="text-center mb-6 text-gray-600">{wordCloud.beschreibung}</p>
      )}
      
      <div
        className="word-cloud"
        style={{
          backgroundColor: wordCloud.hintergrundfarbe,
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center',
          maxWidth: `${wordCloud.maxBreite}px`,
          maxHeight: `${wordCloud.maxHoehe}px`,
          margin: '0 auto',
          overflow: 'hidden',
          border: '2px solid #e5e7eb',
        }}
      >
        {wordCloud.woerter?.map((wort, index) => renderWort(wort, index))}
      </div>
    </div>
  );
};

export default WordCloudComponent;
