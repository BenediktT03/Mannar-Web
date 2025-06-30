// src/components/WordCloudComponent.tsx
// 🎨 WORD CLOUD DISPLAY COMPONENT - Type-Safe & Responsive

'use client';

import React from 'react';
import Link from 'next/link';
import { WordCloud, Word } from '@/types';

// ===============================
// INTERFACE DEFINITIONS
// ===============================

interface WordCloudComponentProps {
  wordCloud: WordCloud;
  isEditable?: boolean;
  isPreview?: boolean;
  className?: string;
  onWordClick?: (word: Word) => void;
  onWordHover?: (word: Word) => void;
  maxWidth?: number;
  maxHeight?: number;
}

// ===============================
// WORD CLOUD COMPONENT
// ===============================

const WordCloudComponent: React.FC<WordCloudComponentProps> = ({
  wordCloud,
  isEditable = false,
  isPreview = false,
  className = '',
  onWordClick,
  onWordHover,
  maxWidth = 800,
  maxHeight = 600,
}) => {
  // Calculate word size based on weight
  const getWordSize = (weight: number): string => {
    const baseSize = 16;
    const size = baseSize + (weight * 4); // 20px to 56px range
    return `${size}px`;
  };

  // Get word styling
  const getWordStyle = (word: Word): React.CSSProperties => ({
    fontSize: getWordSize(word.weight),
    color: word.color,
    margin: '0.5rem',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    cursor: word.link ? 'pointer' : 'default',
    fontWeight: Math.min(900, 400 + word.weight * 50),
    userSelect: isEditable ? 'none' : 'text',
  });

  // Handle word click
  const handleWordClick = (word: Word) => {
    if (onWordClick) {
      onWordClick(word);
    } else if (word.link) {
      if (word.link.startsWith('http')) {
        // External link
        window.open(word.link, '_blank', 'noopener,noreferrer');
      } else {
        // Internal link - would need router for this
        console.log('Navigate to:', word.link);
      }
    }
  };

  // Handle word hover
  const handleWordHover = (word: Word, isHovering: boolean) => {
    if (onWordHover) {
      onWordHover(word);
    }
  };

  // Render individual word
  const renderWord = (word: Word, index: number) => {
    const wordElement = (
      <span
        key={word.id || index}
        style={getWordStyle(word)}
        onClick={() => handleWordClick(word)}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = wordCloud.hoverColor;
          e.currentTarget.style.transform = 'scale(1.1)';
          handleWordHover(word, true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = word.color;
          e.currentTarget.style.transform = 'scale(1)';
          handleWordHover(word, false);
        }}
        title={word.description || word.text}
        role={word.link ? 'button' : 'text'}
        tabIndex={word.link ? 0 : -1}
        onKeyDown={(e) => {
          if (word.link && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleWordClick(word);
          }
        }}
      >
        {word.text}
      </span>
    );

    // If it's an internal Next.js link, wrap with Link component
    if (word.link && !word.link.startsWith('http') && !isPreview) {
      return (
        <Link key={word.id || index} href={word.link} passHref>
          {wordElement}
        </Link>
      );
    }

    return wordElement;
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: wordCloud.backgroundColor,
    color: wordCloud.textColor,
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center',
    maxWidth: `${maxWidth}px`,
    maxHeight: `${maxHeight}px`,
    margin: '0 auto',
    overflow: 'hidden',
    border: '2px solid #e5e7eb',
    lineHeight: '1.6',
    wordWrap: 'break-word',
    position: 'relative',
  };

  return (
    <div className={`word-cloud-container mb-8 ${className}`}>
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {wordCloud.title}
      </h2>

      {/* Description */}
      {wordCloud.description && (
        <p className="text-center mb-6 text-gray-600 max-w-2xl mx-auto">
          {wordCloud.description}
        </p>
      )}

      {/* Word Cloud Container */}
      <div className="word-cloud" style={containerStyle}>
        {wordCloud.words && wordCloud.words.length > 0 ? (
          wordCloud.words.map((word, index) => renderWord(word, index))
        ) : (
          <div className="text-gray-400 italic">
            Keine Wörter vorhanden
          </div>
        )}
      </div>

      {/* Metadata (only in preview/editable mode) */}
      {(isPreview || isEditable) && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <span>📊 {wordCloud.words?.length || 0} Wörter</span>
            <span>🎨 {wordCloud.backgroundColor}</span>
            <span>✍️ {wordCloud.textColor}</span>
            {wordCloud.hoverColor && (
              <span>🖱️ {wordCloud.hoverColor}</span>
            )}
          </div>
        </div>
      )}

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && isEditable && (
        <details className="mt-4 text-xs text-gray-400">
          <summary className="cursor-pointer">Debug Info</summary>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-left overflow-auto">
            {JSON.stringify(wordCloud, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

// ===============================
// ADDITIONAL UTILITY COMPONENTS
// ===============================

// Compact version for cards/lists
export const CompactWordCloud: React.FC<{
  wordCloud: WordCloud;
  maxWords?: number;
  className?: string;
}> = ({ wordCloud, maxWords = 10, className = '' }) => {
  const wordsToShow = wordCloud.words?.slice(0, maxWords) || [];

  return (
    <div className={`compact-word-cloud ${className}`}>
      <div
        className="flex flex-wrap justify-center gap-1 p-3 rounded-lg"
        style={{ backgroundColor: wordCloud.backgroundColor }}
      >
        {wordsToShow.map((word, index) => (
          <span
            key={word.id || index}
            className="px-2 py-1 text-sm rounded"
            style={{
              color: word.color,
              fontSize: `${12 + word.weight}px`,
              fontWeight: 400 + word.weight * 50,
            }}
            title={word.description || word.text}
          >
            {word.text}
          </span>
        ))}
        {wordCloud.words && wordCloud.words.length > maxWords && (
          <span className="text-gray-400 text-sm">
            +{wordCloud.words.length - maxWords} mehr
          </span>
        )}
      </div>
    </div>
  );
};

// Interactive version with editing capabilities
export const EditableWordCloud: React.FC<{
  wordCloud: WordCloud;
  onWordEdit?: (word: Word) => void;
  onWordDelete?: (wordId: string) => void;
}> = ({ wordCloud, onWordEdit, onWordDelete }) => {
  return (
    <WordCloudComponent
      wordCloud={wordCloud}
      isEditable={true}
      onWordClick={(word) => {
        if (onWordEdit) {
          onWordEdit(word);
        }
      }}
      className="editable-word-cloud"
    />
  );
};

export default WordCloudComponent;