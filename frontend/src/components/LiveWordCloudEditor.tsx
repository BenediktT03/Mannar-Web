// frontend/src/components/LiveWordCloudEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { WordCloud, WordCloudWort } from '@/types';
import { getAllWordClouds, createWordCloud, updateWordCloud } from '@/services/api';

interface LiveWordCloudEditorProps {
  onClose: () => void;
}

const LiveWordCloudEditor: React.FC<LiveWordCloudEditorProps> = ({ onClose }) => {
  const [wordClouds, setWordClouds] = useState<WordCloud[]>([]);
  const [selectedCloud, setSelectedCloud] = useState<WordCloud | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCloud, setEditedCloud] = useState<Partial<WordCloud>>({
    titel: 'Neue Word Cloud',
    beschreibung: '',
    istAktiv: true,
    sortierung: 0,
    woerter: [],
    hintergrundfarbe: '#ffffff',
    textfarbe: '#333333',
    hoverfarbe: '#007bff',
    maxBreite: 800,
    maxHoehe: 600
  });
  const [newWord, setNewWord] = useState<Partial<WordCloudWort>>({
    text: '',
    gewichtung: 5,
    farbe: 'inherit',
    link: '',
    istExternerLink: false,
    beschreibung: ''
  });
  const [previewMode, setPreviewMode] = useState(true);

  useEffect(() => {
    loadWordClouds();
  }, []);

  const loadWordClouds = async () => {
    try {
      const response = await getAllWordClouds();
      setWordClouds(response.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Word Clouds:', error);
    }
  };

  const startEditing = (cloud?: WordCloud) => {
    if (cloud) {
      setSelectedCloud(cloud);
      setEditedCloud(cloud);
    } else {
      setSelectedCloud(null);
      setEditedCloud({
        titel: 'Neue Word Cloud',
        beschreibung: '',
        istAktiv: true,
        sortierung: 0,
        woerter: [],
        hintergrundfarbe: '#ffffff',
        textfarbe: '#333333',
        hoverfarbe: '#007bff',
        maxBreite: 800,
        maxHoehe: 600
      });
    }
    setIsEditing(true);
  };

  const saveWordCloud = async () => {
    try {
      if (selectedCloud?.id) {
        await updateWordCloud(selectedCloud.id.toString(), editedCloud);
      } else {
        await createWordCloud(editedCloud);
      }
      await loadWordClouds();
      setIsEditing(false);
      setSelectedCloud(null);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern der Word Cloud');
    }
  };

  const addWord = () => {
    if (!newWord.text) return;
    
    const word: WordCloudWort = {
      text: newWord.text,
      gewichtung: newWord.gewichtung || 5,
      farbe: newWord.farbe || 'inherit',
      link: newWord.link || '',
      istExternerLink: newWord.istExternerLink || false,
      beschreibung: newWord.beschreibung || ''
    };
    
    setEditedCloud({
      ...editedCloud,
      woerter: [...(editedCloud.woerter || []), word]
    });
    
    setNewWord({
      text: '',
      gewichtung: 5,
      farbe: 'inherit',
      link: '',
      istExternerLink: false,
      beschreibung: ''
    });
  };

  const removeWord = (index: number) => {
    const newWords = [...(editedCloud.woerter || [])];
    newWords.splice(index, 1);
    setEditedCloud({
      ...editedCloud,
      woerter: newWords
    });
  };

  const updateWord = (index: number, updatedWord: Partial<WordCloudWort>) => {
    const newWords = [...(editedCloud.woerter || [])];
    newWords[index] = { ...newWords[index], ...updatedWord };
    setEditedCloud({
      ...editedCloud,
      woerter: newWords
    });
  };

  const getWordSize = (gewichtung: number): string => {
    const baseSize = 16;
    const size = baseSize + (gewichtung * 4);
    return `${size}px`;
  };

  const renderLivePreview = () => {
    if (!editedCloud.woerter || editedCloud.woerter.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Füge Wörter hinzu um eine Vorschau zu sehen
        </div>
      );
    }

    return (
      <div
        className="word-cloud-preview p-8 rounded-lg border-2 border-dashed border-gray-300"
        style={{
          backgroundColor: editedCloud.hintergrundfarbe,
          maxWidth: `${editedCloud.maxBreite}px`,
          maxHeight: `${editedCloud.maxHoehe}px`,
          margin: '0 auto',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        {editedCloud.woerter.map((wort, index) => (
          <span
            key={index}
            style={{
              fontSize: getWordSize(wort.gewichtung),
              color: wort.farbe !== 'inherit' ? wort.farbe : editedCloud.textfarbe,
              margin: '0.5rem',
              display: 'inline-block',
              cursor: 'pointer',
              fontWeight: wort.gewichtung > 7 ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = editedCloud.hoverfarbe || '#007bff';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = wort.farbe !== 'inherit' ? wort.farbe! : editedCloud.textfarbe!;
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={wort.beschreibung}
          >
            {wort.text}
          </span>
        ))}
      </div>
    );
  };

  if (!isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Word Cloud Manager</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => startEditing()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              ✨ Neue Word Cloud erstellen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wordClouds.map((cloud) => (
              <div key={cloud.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{cloud.titel}</h3>
                <p className="text-gray-600 text-sm mb-3">{cloud.beschreibung}</p>
                <div className="text-sm text-gray-500 mb-3">
                  {cloud.woerter?.length || 0} Wörter
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(cloud)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Bearbeiten
                  </button>
                  <span className={`px-2 py-1 rounded text-xs ${cloud.istAktiv ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {cloud.istAktiv ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Live Word Cloud Editor
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg font-medium ${previewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {previewMode ? '👁️ Vorschau' : '⚙️ Bearbeiten'}
            </button>
            <button
              onClick={saveWordCloud}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              💾 Speichern
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              ← Zurück
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Editor Panel */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Word Cloud Einstellungen</h3>
            
            {/* Basic Settings */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                <input
                  type="text"
                  value={editedCloud.titel || ''}
                  onChange={(e) => setEditedCloud({ ...editedCloud, titel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                <textarea
                  value={editedCloud.beschreibung || ''}
                  onChange={(e) => setEditedCloud({ ...editedCloud, beschreibung: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Color Settings */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">🎨 Farben</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hintergrund</label>
                  <input
                    type="color"
                    value={editedCloud.hintergrundfarbe || '#ffffff'}
                    onChange={(e) => setEditedCloud({ ...editedCloud, hintergrundfarbe: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                  <input
                    type="color"
                    value={editedCloud.textfarbe || '#333333'}
                    onChange={(e) => setEditedCloud({ ...editedCloud, textfarbe: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hover</label>
                  <input
                    type="color"
                    value={editedCloud.hoverfarbe || '#007bff'}
                    onChange={(e) => setEditedCloud({ ...editedCloud, hoverfarbe: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Add New Word */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">➕ Neues Wort hinzufügen</h4>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Wort eingeben..."
                    value={newWord.text || ''}
                    onChange={(e) => setNewWord({ ...newWord, text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Gewichtung: {newWord.gewichtung}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newWord.gewichtung || 5}
                      onChange={(e) => setNewWord({ ...newWord, gewichtung: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Farbe</label>
                    <input
                      type="color"
                      value={newWord.farbe === 'inherit' ? '#333333' : newWord.farbe || '#333333'}
                      onChange={(e) => setNewWord({ ...newWord, farbe: e.target.value })}
                      className="w-full h-8 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Link (optional)"
                    value={newWord.link || ''}
                    onChange={(e) => setNewWord({ ...newWord, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={addWord}
                  disabled={!newWord.text}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-md font-medium"
                >
                  Wort hinzufügen
                </button>
              </div>
            </div>

            {/* Word List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">📝 Wörter ({editedCloud.woerter?.length || 0})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {editedCloud.woerter?.map((wort, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span 
                      className="flex-1 font-medium"
                      style={{ 
                        color: wort.farbe !== 'inherit' ? wort.farbe : editedCloud.textfarbe,
                        fontSize: `${12 + wort.gewichtung}px`
                      }}
                    >
                      {wort.text}
                    </span>
                    <span className="text-xs text-gray-500">
                      {wort.gewichtung}/10
                    </span>
                    <button
                      onClick={() => removeWord(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">🔮 Live Vorschau</h3>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{editedCloud.titel}</h4>
              {editedCloud.beschreibung && (
                <p className="text-gray-600 text-sm mb-4">{editedCloud.beschreibung}</p>
              )}
              {renderLivePreview()}
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Hintergrund:</strong> {editedCloud.hintergrundfarbe}</p>
              <p><strong>Textfarbe:</strong> {editedCloud.textfarbe}</p>
              <p><strong>Hover-Farbe:</strong> {editedCloud.hoverfarbe}</p>
              <p><strong>Wörter:</strong> {editedCloud.woerter?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveWordCloudEditor;