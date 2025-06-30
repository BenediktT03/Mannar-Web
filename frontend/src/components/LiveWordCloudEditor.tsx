// src/components/LiveWordCloudEditor.tsx
// 🎨 LIVE WORD CLOUD EDITOR - Professional Split-Screen Interface

'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ComponentErrorBoundary } from './ErrorBoundary';
import { useDebounce, useNotifications } from '../hooks';
import type { WordCloud, Word, WordCloudPayload } from '../types';

// ===============================
// INTERFACE DEFINITIONS
// ===============================

interface LiveWordCloudEditorProps {
  initialWordCloud?: WordCloud;
  onSave: (wordCloud: WordCloudPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface WordFormData {
  text: string;
  weight: number;
  color: string;
  link: string;
  description: string;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

// ===============================
// COLOR PICKER COMPONENT
// ===============================

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
      </div>
    </div>
  );
};

// ===============================
// WORD FORM COMPONENT
// ===============================

const WordForm: React.FC<{
  onAddWord: (word: Omit<Word, 'id'>) => void;
}> = ({ onAddWord }) => {
  const [formData, setFormData] = useState<WordFormData>({
    text: '',
    weight: 5,
    color: '#3B82F6',
    link: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<WordFormData>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<WordFormData> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Text ist erforderlich';
    }

    if (formData.weight < 1 || formData.weight > 10) {
      newErrors.weight = 'Gewichtung muss zwischen 1 und 10 liegen';
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      newErrors.color = 'Ungültiger Hex-Farbcode';
    }

    if (formData.link && !/^https?:\/\/.+/.test(formData.link)) {
      newErrors.link = 'Link muss mit http:// oder https:// beginnen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddWord({
        text: formData.text.trim(),
        weight: formData.weight,
        color: formData.color,
        link: formData.link.trim() || undefined,
        description: formData.description.trim() || undefined,
      });

      // Reset form
      setFormData({
        text: '',
        weight: 5,
        color: '#3B82F6',
        link: '',
        description: '',
      });
    }
  }, [formData, validateForm, onAddWord]);

  const updateField = useCallback((field: keyof WordFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-4">🆕 Neues Wort hinzufügen</h3>
      
      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text
        </label>
        <input
          type="text"
          value={formData.text}
          onChange={(e) => updateField('text', e.target.value)}
          placeholder="z.B. Meditation"
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.text ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text}</p>
        )}
      </div>

      {/* Weight Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gewichtung: {formData.weight}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.weight}
          onChange={(e) => updateField('weight', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Klein (1)</span>
          <span>Groß (10)</span>
        </div>
        {errors.weight && (
          <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
        )}
      </div>

      {/* Color Picker */}
      <ColorPicker
        label="Farbe"
        value={formData.color}
        onChange={(color) => updateField('color', color)}
      />
      {errors.color && (
        <p className="mt-1 text-sm text-red-600">{errors.color}</p>
      )}

      {/* Link Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link (optional)
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => updateField('link', e.target.value)}
          placeholder="https://example.com"
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.link ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.link && (
          <p className="mt-1 text-sm text-red-600">{errors.link}</p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beschreibung (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Tooltip-Text für das Wort"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
      >
        ➕ Wort hinzufügen
      </button>
    </form>
  );
};

// ===============================
// WORD LIST COMPONENT
// ===============================

const WordList: React.FC<{
  words: Word[];
  onUpdateWord: (id: string, updates: Partial<Word>) => void;
  onDeleteWord: (id: string) => void;
}> = ({ words, onUpdateWord, onDeleteWord }) => {
  if (words.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Noch keine Wörter hinzugefügt</p>
        <p className="text-sm">Fügen Sie das erste Wort hinzu!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800 mb-3">📝 Wörter ({words.length})</h3>
      
      {words.map((word) => (
        <div
          key={word.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: word.color }}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span
                  className="font-medium"
                  style={{ 
                    color: word.color,
                    fontSize: `${0.8 + (word.weight / 10) * 0.6}rem`
                  }}
                >
                  {word.text}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {word.weight}
                </span>
              </div>
              {word.description && (
                <p className="text-xs text-gray-600 mt-1">{word.description}</p>
              )}
              {word.link && (
                
                  href={word.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                >
                  🔗 {word.link}
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newWeight = prompt('Neue Gewichtung (1-10):', word.weight.toString());
                if (newWeight && !isNaN(parseInt(newWeight))) {
                  const weight = Math.max(1, Math.min(10, parseInt(newWeight)));
                  onUpdateWord(word.id, { weight });
                }
              }}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Gewichtung ändern"
            >
              ⚖️
            </button>
            
            <button
              onClick={() => {
                const newColor = prompt('Neue Farbe (Hex-Code):', word.color);
                if (newColor && /^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                  onUpdateWord(word.id, { color: newColor });
                }
              }}
              className="text-gray-400 hover:text-green-600 transition-colors"
              title="Farbe ändern"
            >
              🎨
            </button>
            
            <button
              onClick={() => {
                if (confirm(`Wort "${word.text}" wirklich löschen?`)) {
                  onDeleteWord(word.id);
                }
              }}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Löschen"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===============================
// WORD CLOUD PREVIEW COMPONENT
// ===============================

const WordCloudPreview: React.FC<{
  wordCloud: WordCloudPayload;
}> = ({ wordCloud }) => {
  const { words, backgroundColor } = wordCloud;

  // Calculate word positions in a simple cloud layout
  const wordElements = useMemo(() => {
    return words.map((word, index) => {
      // Simple positioning algorithm
      const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
      const radius = Math.sqrt(index + 1) * 30;
      const x = 50 + (radius * Math.cos(angle)) / 4;
      const y = 50 + (radius * Math.sin(angle)) / 4;
      
      return {
        ...word,
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
      };
    });
  }, [words]);

  return (
    <div
      className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200"
      style={{ backgroundColor }}
    >
      {/* Preview Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-gray-800">{wordCloud.title || 'Unbenannte Word Cloud'}</h3>
          {wordCloud.description && (
            <p className="text-sm text-gray-600 mt-1">{wordCloud.description}</p>
          )}
        </div>
      </div>

      {/* Word Cloud */}
      <div className="absolute inset-0 pt-24">
        {wordElements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">☁️</div>
              <p>Keine Wörter vorhanden</p>
              <p className="text-sm">Fügen Sie Wörter hinzu, um die Vorschau zu sehen</p>
            </div>
          </div>
        ) : (
          wordElements.map((word) => (
            <div
              key={word.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                left: `${word.x}%`,
                top: `${word.y}%`,
                color: word.color,
                fontSize: `${0.8 + (word.weight / 10) * 2}rem`,
                fontWeight: Math.min(900, 400 + word.weight * 50),
              }}
              title={word.description || word.text}
              onClick={() => {
                if (word.link) {
                  window.open(word.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {word.text}
            </div>
          ))
        )}
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-black/70 text-white text-xs px-3 py-2 rounded-lg">
          {words.length} Wörter
        </div>
      </div>
    </div>
  );
};

// ===============================
// MAIN LIVE EDITOR COMPONENT
// ===============================

const LiveWordCloudEditor: React.FC<LiveWordCloudEditorProps> = ({
  initialWordCloud,
  onSave,
  onCancel,
  isLoading = false,
  error = null,
}) => {
  // Notifications
  const { success, error: showError } = useNotifications();

  // Editor State
  const [wordCloud, setWordCloud] = useState<WordCloudPayload>(() => ({
    title: initialWordCloud?.title || '',
    description: initialWordCloud?.description || '',
    words: initialWordCloud?.words || [],
    backgroundColor: initialWordCloud?.backgroundColor || '#FFFFFF',
    textColor: initialWordCloud?.textColor || '#000000',
    hoverColor: initialWordCloud?.hoverColor || '#3B82F6',
  }));

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced word cloud for performance
  const debouncedWordCloud = useDebounce(wordCloud, 300);

  // Track changes
  useEffect(() => {
    if (initialWordCloud) {
      const hasChanges = JSON.stringify(wordCloud) !== JSON.stringify({
        title: initialWordCloud.title,
        description: initialWordCloud.description,
        words: initialWordCloud.words,
        backgroundColor: initialWordCloud.backgroundColor,
        textColor: initialWordCloud.textColor,
        hoverColor: initialWordCloud.hoverColor,
      });
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(
        wordCloud.title.trim() !== '' || 
        wordCloud.description.trim() !== '' || 
        wordCloud.words.length > 0
      );
    }
  }, [wordCloud, initialWordCloud]);

  // Update word cloud field
  const updateWordCloud = useCallback((updates: Partial<WordCloudPayload>) => {
    setWordCloud(prev => ({ ...prev, ...updates }));
  }, []);

  // Add new word
  const addWord = useCallback((wordData: Omit<Word, 'id'>) => {
    const newWord: Word = {
      ...wordData,
      id: `word_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setWordCloud(prev => ({
      ...prev,
      words: [...prev.words, newWord],
    }));

    success('Wort hinzugefügt', `"${wordData.text}" wurde zur Word Cloud hinzugefügt`);
  }, [success]);

  // Update word
  const updateWord = useCallback((id: string, updates: Partial<Word>) => {
    setWordCloud(prev => ({
      ...prev,
      words: prev.words.map(word => 
        word.id === id ? { ...word, ...updates } : word
      ),
    }));
  }, []);

  // Delete word
  const deleteWord = useCallback((id: string) => {
    setWordCloud(prev => ({
      ...prev,
      words: prev.words.filter(word => word.id !== id),
    }));

    success('Wort entfernt', 'Das Wort wurde aus der Word Cloud entfernt');
  }, [success]);

  // Save word cloud
  const handleSave = useCallback(async () => {
    if (!wordCloud.title.trim()) {
      showError('Fehler', 'Bitte geben Sie einen Titel ein');
      return;
    }

    if (wordCloud.words.length === 0) {
      showError('Fehler', 'Bitte fügen Sie mindestens ein Wort hinzu');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(wordCloud);
      setHasUnsavedChanges(false);
      success('Gespeichert', 'Word Cloud wurde erfolgreich gespeichert');
    } catch (error) {
      showError('Speichern fehlgeschlagen', error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setIsSaving(false);
    }
  }, [wordCloud, onSave, success, showError]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      if (confirm('Ungespeicherte Änderungen gehen verloren. Wirklich abbrechen?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  }, [hasUnsavedChanges, onCancel]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              ✨ Live Word Cloud Editor
            </h1>
            <p className="text-sm text-gray-600">
              {initialWordCloud ? 'Bearbeiten' : 'Erstellen'} Sie Ihre Word Cloud mit Live-Vorschau
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <span className="text-orange-600 text-sm font-medium">
                🔄 Ungespeicherte Änderungen
              </span>
            )}
            
            <button
              onClick={handleCancel}
              disabled={isLoading || isSaving}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              Abbrechen
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading || isSaving || !hasUnsavedChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {isSaving ? '💾 Speichern...' : '💾 Speichern'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-800">
                <strong>Fehler:</strong> {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">⚙️ Grundeinstellungen</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={wordCloud.title}
                  onChange={(e) => updateWordCloud({ title: e.target.value })}
                  placeholder="Meine Word Cloud"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={wordCloud.description}
                  onChange={(e) => updateWordCloud({ description: e.target.value })}
                  placeholder="Beschreibung der Word Cloud"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Color Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">🎨 Farbeinstellungen</h2>
              
              <ColorPicker
                label="Hintergrundfarbe"
                value={wordCloud.backgroundColor}
                onChange={(color) => updateWordCloud({ backgroundColor: color })}
              />
              
              <ColorPicker
                label="Standard-Textfarbe"
                value={wordCloud.textColor}
                onChange={(color) => updateWordCloud({ textColor: color })}
              />
              
              <ColorPicker
                label="Hover-Farbe"
                value={wordCloud.hoverColor}
                onChange={(color) => updateWordCloud({ hoverColor: color })}
              />
            </div>

            {/* Word Form */}
            <ComponentErrorBoundary componentName="Word Form">
              <WordForm onAddWord={addWord} />
            </ComponentErrorBoundary>

            {/* Words List */}
            <ComponentErrorBoundary componentName="Word List">
              <WordList
                words={wordCloud.words}
                onUpdateWord={updateWord}
                onDeleteWord={deleteWord}
              />
            </ComponentErrorBoundary>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 bg-gray-50">
          <div className="h-full p-6">
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">👁️ Live-Vorschau</h2>
                <div className="text-sm text-gray-500">
                  Real-time Update
                </div>
              </div>
              
              <ComponentErrorBoundary componentName="Word Cloud Preview">
                <WordCloudPreview wordCloud={debouncedWordCloud} />
              </ComponentErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isLoading || isSaving) && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-900 font-medium">
                {isSaving ? 'Speichern...' : 'Laden...'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveWordCloudEditor;