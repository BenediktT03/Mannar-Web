'use client';

import React from 'react';
import { SeitenConfig } from '@/types';

interface DynamicStylesProps {
  config: SeitenConfig;
}

const DynamicStyles: React.FC<DynamicStylesProps> = ({ config }) => {
  const styles = `
    :root {
      --color-primary: ${config.primaryColor || '#4f46e5'};
      --color-secondary: ${config.secondaryColor || '#10b981'};
      --color-background: ${config.backgroundColor || '#f9fafb'};
      --color-text: ${config.textColor || '#111827'};
      --color-header: ${config.headerColor || config.primaryColor || '#1f2937'};
      --color-footer: ${config.footerColor || config.headerColor || config.primaryColor || '#374151'};
    }

    body {
      background-color: var(--color-background);
      color: var(--color-text);
    }

    .btn-primary {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--color-secondary);
      border-color: var(--color-secondary);
    }

    a {
      color: var(--color-primary);
    }

    a:hover {
      color: var(--color-secondary);
    }

    .word-cloud-link {
      transition: all 0.3s ease;
    }

    .word-cloud-link:hover {
      color: var(--color-primary) !important;
      transform: scale(1.1);
    }

    .header {
      background-color: var(--color-header);
    }

    .footer {
      background-color: var(--color-footer);
    }

    ${config.customCSS || ''}
  `;

  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
};

export default DynamicStyles;