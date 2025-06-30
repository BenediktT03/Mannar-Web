// src/components/LiveWordCloudEditor.tsx
// 🎨 LIVE WORD CLOUD EDITOR - Type-Safe Implementation

'use client';

import React, { useState, useCallback, useEffect } from 'react';
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

  const [errors, setErrors] = useState<Partial<Record<keyof WordFormData, string>>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof WordFormData, string>> = {};

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

  // Specific handlers for each field type
  const updateText = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, text: value }));
    if (errors.text) {
      setErrors(prev => ({ ...prev, text: undefined }));
    }
  }, [errors.text]);

  const updateWeight = useCallback((value: number) => {
    setFormData(prev => ({ ...prev, weight: value }));
    if (errors.weight) {
      setErrors(prev => ({ ...prev, weight: undefined }));
    }
  }, [errors.weight]);

  const updateColor = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, color: value }));
    if (errors.color) {
      setErrors(prev => ({ ...prev, color: undefined }));
    }
  }, [errors.color]);

  const updateLink = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, link: value }));
    if (errors.link) {
      setErrors(prev => ({ ...prev, link: undefined }));
    }
  }, [errors.link]);

  const updateDescription = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
  }, [errors.description]);

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
          onChange={(e) => updateText(e.target.value)}
          placeholder="z.B. Meditation"
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.text ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text}</p>
        )}
      </div>

      {/* Weight Slider - Fixed with direct number handling */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gewichtung: {formData.weight}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.weight}
          onChange={(e) => updateWeight(Number(e.target.value))}
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
        onChange={updateColor}
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
          onChange={(e) => updateLink(e.target.value)}
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
          onChange={(e) => updateDescription(e.target.value)}
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
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">📝 Wörter ({words.length})</h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {words.map((word) => (
          <div key={word.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                {/* Word Text */}
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: word.color }}
                  />
                  <input
                    type="text"
                    value={word.text}
                    onChange={(e) => onUpdateWord(word.id, { text: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-xs text-gray-500 min-w-0">
                    Gewicht: {word.weight}
                  </span>
                </div>

                {/* Weight Slider */}
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={word.weight}
                  onChange={(e) => onUpdateWord(word.id, { weight: Number(e.target.value) })}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />

                {/* Link and Description */}
                {(word.link || word.description) && (
                  <div className="space-y-1">
                    {word.link && (
                      <a
                        href={word.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        🔗 {word.link}
                      </a>
                    )}
                    {word.description && (
                      <p className="text-xs text-gray-600">
                        💭 {word.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => onDeleteWord(word.id)}
                className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                title="Wort löschen"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===============================
// WORD CLOUD PREVIEW COMPONENT
// ===============================

const WordCloudPreview: React.FC<{
  wordCloud: WordCloudPayload;
}> = ({ wordCloud }) => {
  const getWordStyle = (word: Word) => ({
    color: word.color,
    fontSize: `${0.8 + (word.weight / 10) * 2}rem`,
    fontWeight: Math.min(900, 400 + word.weight * 50),
    margin: '0.25rem',
    display: 'inline-block',
    transition: 'all 0.2s ease',
    cursor: word.link ? 'pointer' : 'default',
  });

  const handleWordClick = (word: Word) => {
    if (word.link) {
      window.open(word.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-center text-gray-800">
          {wordCloud.title || 'Unbenannte Word Cloud'}
        </h3>
        {wordCloud.description && (
          <p className="text-center text-gray-600 mt-2">
            {wordCloud.description}
          </p>
        )}
      </div>

      {/* Word Cloud Container */}
      <div
        className="flex-1 p-6 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
        style={{
          backgroundColor: wordCloud.backgroundColor,
          color: wordCloud.textColor,
        }}
      >
        {wordCloud.words.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg">Keine Wörter vorhanden</p>
              <p className="text-sm">Fügen Sie Wörter hinzu, um die Vorschau zu sehen</p>
            </div>
          </div>
        ) : (
          <div className="text-center leading-relaxed">
            {wordCloud.words.map((word) => (
              <span
                key={word.id}
                style={getWordStyle(word)}
                onClick={() => handleWordClick(word)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = wordCloud.hoverColor;
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = word.color;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={word.description}
              >
                {word.text}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-4 text-sm text-gray-600 bg-white/70 px-3 py-2 rounded-lg">
          <span>📊 {wordCloud.words.length} Wörter</span>
          <span>🎨 {wordCloud.backgroundColor}</span>
          <span>✍️ {wordCloud.textColor}</span>
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
  }, []);

  // Save handler
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(wordCloud);
      setHasUnsavedChanges(false);
      success('Word Cloud gespeichert', 'Ihre Änderungen wurden erfolgreich gespeichert');
    } catch (err) {
      showError('Speichern fehlgeschlagen', 'Ihre Word Cloud konnte nicht gespeichert werden');
    } finally {
      setIsSaving(false);
    }
  }, [wordCloud, onSave, success, showError]);

  return (
    <div className="h-screen flex flex-col bg-gray-100 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">
              🎨 Word Cloud Editor
            </h1>
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                ⚠️ Ungespeicherte Änderungen
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ❌ Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
                  placeholder="Beschreibung Ihrer Word Cloud"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Color Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">🎨 Farben</h2>
              
              <ColorPicker
                label="Hintergrundfarbe"
                value={wordCloud.backgroundColor}
                onChange={(color) => updateWordCloud({ backgroundColor: color })}
              />
              
              <ColorPicker
                label="Textfarbe"
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