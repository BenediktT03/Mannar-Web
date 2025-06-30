// src/components/DynamicStyles.tsx
// 🎨 DYNAMIC STYLES COMPONENT
// Generiert dynamische CSS Styles für Word Clouds

'use client';

import React from 'react';
import type { WordCloud } from '@/types';

// ===============================
// INTERFACE DEFINITIONS
// ===============================

interface DynamicStylesProps {
  wordCloud?: WordCloud;
  className?: string;
}

// ===============================
// DYNAMIC STYLES COMPONENT
// ===============================

const DynamicStyles: React.FC<DynamicStylesProps> = ({ 
  wordCloud,
  className = 'dynamic-word-cloud'
}) => {
  // Wenn keine Word Cloud übergeben wurde, keine Styles generieren
  if (!wordCloud) {
    return null;
  }

  // CSS Styles für die Word Cloud generieren
  const generateStyles = (): string => {
    const styles = [`
      .${className} {
        background-color: ${wordCloud.backgroundColor};
        color: ${wordCloud.textColor};
        transition: all 0.3s ease;
      }
      
      .${className} .word-item {
        color: ${wordCloud.textColor};
        transition: all 0.2s ease;
      }
      
      .${className} .word-item:hover {
        color: ${wordCloud.hoverColor};
        transform: scale(1.1);
      }
    `];

    // Individuelle Styles für jedes Wort
    wordCloud.words.forEach((word) => {
      styles.push(`
        .${className} .word-${word.id} {
          color: ${word.color};
          font-weight: ${Math.min(900, 400 + word.weight * 50)};
          font-size: ${0.8 + (word.weight / 10) * 2}rem;
        }
        
        .${className} .word-${word.id}:hover {
          color: ${wordCloud.hoverColor};
          transform: scale(1.1);
        }
      `);
    });

    return styles.join('\n');
  };

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: generateStyles(),
      }}
    />
  );
};

// ===============================
// WORD CLOUD STYLES HOOK
// ===============================

export const useWordCloudStyles = (wordCloud?: WordCloud) => {
  const [styles, setStyles] = React.useState<string>('');

  React.useEffect(() => {
    if (!wordCloud) {
      setStyles('');
      return;
    }

    const cssRules = [
      `background-color: ${wordCloud.backgroundColor}`,
      `color: ${wordCloud.textColor}`,
    ];

    setStyles(cssRules.join('; '));
  }, [wordCloud]);

  return styles;
};

// ===============================
// STYLE UTILITIES
// ===============================

export const getWordStyle = (
  word: { color: string; weight: number },
  hoverColor?: string
) => {
  return {
    color: word.color,
    fontSize: `${0.8 + (word.weight / 10) * 2}rem`,
    fontWeight: Math.min(900, 400 + word.weight * 50),
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '--hover-color': hoverColor || '#3B82F6',
  } as React.CSSProperties;
};

export const getWordCloudStyle = (
  wordCloud: Pick<WordCloud, 'backgroundColor' | 'textColor' | 'hoverColor'>
) => {
  return {
    backgroundColor: wordCloud.backgroundColor,
    color: wordCloud.textColor,
    transition: 'all 0.3s ease',
    '--hover-color': wordCloud.hoverColor,
  } as React.CSSProperties;
};

// ===============================
// CSS CLASS GENERATOR
// ===============================

export const generateWordCloudCSS = (wordCloud: WordCloud): string => {
  const baseCSS = `
    .word-cloud-container {
      background-color: ${wordCloud.backgroundColor};
      color: ${wordCloud.textColor};
      transition: all 0.3s ease;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .word-cloud-word {
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }
    
    .word-cloud-word:hover {
      color: ${wordCloud.hoverColor} !important;
      transform: translate(-50%, -50%) scale(1.1);
    }
  `;

  const wordCSS = wordCloud.words.map((word) => `
    .word-cloud-word[data-word-id="${word.id}"] {
      color: ${word.color};
      font-size: ${0.8 + (word.weight / 10) * 2}rem;
      font-weight: ${Math.min(900, 400 + word.weight * 50)};
    }
  `).join('\n');

  return baseCSS + wordCSS;
};

// ===============================
// EXPORTS
// ===============================

export default DynamicStyles;

export {
  useWordCloudStyles,
  getWordStyle,
  getWordCloudStyle,
  generateWordCloudCSS,
};

// ===============================
// USAGE EXAMPLES
// ===============================

/*
🎨 USAGE EXAMPLES:

// 1. Basic Dynamic Styles
const MyWordCloud = ({ wordCloud }) => {
  return (
    <div>
      <DynamicStyles wordCloud={wordCloud} className="my-word-cloud" />
      <div className="my-word-cloud">
        {wordCloud.words.map(word => (
          <span key={word.id} className={`word-item word-${word.id}`}>
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};

// 2. Using Hooks
const MyComponent = ({ wordCloud }) => {
  const styles = useWordCloudStyles(wordCloud);
  
  return (
    <div style={{ styles }}>
      Word Cloud Content
    </div>
  );
};

// 3. Inline Styles
const WordComponent = ({ word, hoverColor }) => {
  const style = getWordStyle(word, hoverColor);
  
  return (
    <span style={style}>
      {word.text}
    </span>
  );
};

// 4. CSS Generation
const generateStyleSheet = (wordCloud) => {
  const css = generateWordCloudCSS(wordCloud);
  
  // Inject into document head
  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};
*/