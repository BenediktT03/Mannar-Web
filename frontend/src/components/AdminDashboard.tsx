// src/components/AdminDashboard.tsx
// 🛠️ COMPREHENSIVE ADMIN DASHBOARD - Complete Website Builder

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ComponentErrorBoundary } from './ErrorBoundary';
import { useAuth } from '@/hooks';
import type { WordCloud } from '@/types';

// ===============================
// TYPES & INTERFACES
// ===============================

interface SiteConfig {
  // Logo & Branding
  siteName: string;
  logoText: string;
  logoImage?: string;
  favicon?: string;
  
  // Colors & Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Typography
  headingFont: string;
  bodyFont: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // Layout
  layoutStyle: 'minimal' | 'modern' | 'classic' | 'spiritual';
  headerStyle: 'fixed' | 'static' | 'hidden';
  footerStyle: 'minimal' | 'detailed' | 'hidden';
  
  // SEO & Meta
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  // Social Media
  socialLinks: {
    email?: string;
    phone?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  
  // Contact Info
  contactInfo: {
    address?: string;
    city?: string;
    country?: string;
    businessHours?: string;
  };
  
  // Features
  enableWordClouds: boolean;
  enableBlog: boolean;
  enableGallery: boolean;
  enableContact: boolean;
  enableBooking: boolean;
  enableNewsletter: boolean;
  
  // Advanced
  customCSS?: string;
  customHTML?: string;
  analytics?: {
    googleAnalytics?: string;
    facebookPixel?: string;
  };
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  showInNavigation: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  customCSS?: string;
  pageType: 'standard' | 'homepage' | 'contact' | 'about' | 'services';
  components: PageComponent[];
}

interface PageComponent {
  id: string;
  type: 'hero' | 'text' | 'image' | 'wordcloud' | 'gallery' | 'contact' | 'testimonials' | 'services';
  content: any;
  settings: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    alignment?: 'left' | 'center' | 'right';
    animation?: string;
  };
  sortOrder: number;
}

interface DashboardTab {
  id: string;
  label: string;
  icon: string;
  component: React.ReactNode;
}

// ===============================
// SITE CONFIGURATION PANEL
// ===============================

const SiteConfigPanel: React.FC<{
  config: SiteConfig;
  onUpdate: (config: Partial<SiteConfig>) => void;
}> = ({ config, onUpdate }) => {
  const [activeSubTab, setActiveSubTab] = useState('branding');

  const subTabs = [
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'colors', label: 'Farben', icon: '🌈' },
    { id: 'typography', label: 'Schriften', icon: '📝' },
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'contact', label: 'Kontakt', icon: '📞' },
    { id: 'features', label: 'Features', icon: '⚙️' },
    { id: 'advanced', label: 'Erweitert', icon: '🔧' },
  ];

  const renderBrandingTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website Name
        </label>
        <input
          type="text"
          value={config.siteName}
          onChange={(e) => onUpdate({ siteName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Mannar Spiritual Guidance"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo Text
        </label>
        <input
          type="text"
          value={config.logoText}
          onChange={(e) => onUpdate({ logoText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Mannar"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo Bild hochladen
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" accept="image/*" className="hidden" id="logo-upload" />
          <label htmlFor="logo-upload" className="cursor-pointer">
            <div className="text-gray-400 mb-2">📁</div>
            <p className="text-gray-500">Klicken zum Hochladen</p>
            <p className="text-xs text-gray-400">PNG, JPG, SVG bis 2MB</p>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Favicon hochladen
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input type="file" accept="image/*" className="hidden" id="favicon-upload" />
          <label htmlFor="favicon-upload" className="cursor-pointer">
            <div className="text-gray-400 mb-1">🔖</div>
            <p className="text-sm text-gray-500">Favicon hochladen</p>
          </label>
        </div>
      </div>
    </div>
  );

  const renderColorsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'primaryColor', label: 'Primärfarbe', value: config.primaryColor },
          { key: 'secondaryColor', label: 'Sekundärfarbe', value: config.secondaryColor },
          { key: 'accentColor', label: 'Akzentfarbe', value: config.accentColor },
          { key: 'backgroundColor', label: 'Hintergrund', value: config.backgroundColor },
          { key: 'textColor', label: 'Textfarbe', value: config.textColor },
        ].map((color) => (
          <div key={color.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {color.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color.value}
                onChange={(e) => onUpdate({ [color.key]: e.target.value })}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <input
                type="text"
                value={color.value}
                onChange={(e) => onUpdate({ [color.key]: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Farbpaletten-Vorschläge</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Spiritual', colors: ['#8B5E3C', '#D17C62', '#F5E9DA'] },
            { name: 'Modern', colors: ['#2563EB', '#06B6D4', '#F3F4F6'] },
            { name: 'Nature', colors: ['#059669', '#84CC16', '#ECFDF5'] },
            { name: 'Elegant', colors: ['#1F2937', '#6B7280', '#F9FAFB'] },
          ].map((palette) => (
            <button
              key={palette.name}
              onClick={() => onUpdate({
                primaryColor: palette.colors[0],
                secondaryColor: palette.colors[1],
                backgroundColor: palette.colors[2],
              })}
              className="text-left p-3 bg-white rounded border hover:border-blue-500 transition-colors"
            >
              <div className="text-sm font-medium mb-2">{palette.name}</div>
              <div className="flex space-x-1">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypographyTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Überschriften-Schrift
        </label>
        <select
          value={config.headingFont}
          onChange={(e) => onUpdate({ headingFont: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="Inter">Inter (Modern)</option>
          <option value="Playfair Display">Playfair Display (Elegant)</option>
          <option value="Roboto">Roboto (Clean)</option>
          <option value="Merriweather">Merriweather (Serif)</option>
          <option value="Montserrat">Montserrat (Sans-Serif)</option>
          <option value="Crimson Text">Crimson Text (Literary)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text-Schrift
        </label>
        <select
          value={config.bodyFont}
          onChange={(e) => onUpdate({ bodyFont: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="Inter">Inter (Modern)</option>
          <option value="Open Sans">Open Sans (Readable)</option>
          <option value="Source Sans Pro">Source Sans Pro (Clean)</option>
          <option value="Lato">Lato (Friendly)</option>
          <option value="Nunito">Nunito (Rounded)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Schriftgröße
        </label>
        <div className="flex space-x-4">
          {[
            { value: 'small', label: 'Klein' },
            { value: 'medium', label: 'Mittel' },
            { value: 'large', label: 'Groß' },
          ].map((size) => (
            <label key={size.value} className="flex items-center">
              <input
                type="radio"
                name="fontSize"
                value={size.value}
                checked={config.fontSize === size.value}
                onChange={(e) => onUpdate({ fontSize: e.target.value as any })}
                className="mr-2"
              />
              {size.label}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Vorschau</h4>
        <div style={{ fontFamily: config.headingFont }}>
          <h2 className="text-2xl font-bold mb-2">Überschrift Beispiel</h2>
        </div>
        <div style={{ fontFamily: config.bodyFont }}>
          <p className="text-gray-600">
            Dies ist ein Beispieltext um zu sehen, wie die gewählte Schrift aussieht.
            Sie können verschiedene Schriftarten ausprobieren und sofort das Ergebnis sehen.
          </p>
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layout-Stil
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'minimal', label: 'Minimal', desc: 'Reduziert und fokussiert' },
            { value: 'modern', label: 'Modern', desc: 'Zeitgemäß und professionell' },
            { value: 'classic', label: 'Klassisch', desc: 'Bewährt und elegant' },
            { value: 'spiritual', label: 'Spirituell', desc: 'Beruhigend und harmonisch' },
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => onUpdate({ layoutStyle: style.value as any })}
              className={`text-left p-4 border rounded-lg transition-colors ${
                config.layoutStyle === style.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{style.label}</div>
              <div className="text-sm text-gray-500">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Header-Stil
        </label>
        <div className="space-y-2">
          {[
            { value: 'fixed', label: 'Fest (bleibt oben)' },
            { value: 'static', label: 'Statisch (scrollt mit)' },
            { value: 'hidden', label: 'Versteckt' },
          ].map((style) => (
            <label key={style.value} className="flex items-center">
              <input
                type="radio"
                name="headerStyle"
                value={style.value}
                checked={config.headerStyle === style.value}
                onChange={(e) => onUpdate({ headerStyle: e.target.value as any })}
                className="mr-3"
              />
              {style.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Footer-Stil
        </label>
        <div className="space-y-2">
          {[
            { value: 'minimal', label: 'Minimal (nur Impressum)' },
            { value: 'detailed', label: 'Detailliert (mit Links)' },
            { value: 'hidden', label: 'Versteckt' },
          ].map((style) => (
            <label key={style.value} className="flex items-center">
              <input
                type="radio"
                name="footerStyle"
                value={style.value}
                checked={config.footerStyle === style.value}
                onChange={(e) => onUpdate({ footerStyle: e.target.value as any })}
                className="mr-3"
              />
              {style.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Titel
        </label>
        <input
          type="text"
          value={config.metaTitle}
          onChange={(e) => onUpdate({ metaTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Mannar - Spirituelle Genesungsbegleitung"
        />
        <p className="text-sm text-gray-500 mt-1">Erscheint in Google Suchergebnissen (max. 60 Zeichen)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Beschreibung
        </label>
        <textarea
          value={config.metaDescription}
          onChange={(e) => onUpdate({ metaDescription: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Professionelle spirituelle Begleitung für Ihre persönliche Heilungsreise..."
        />
        <p className="text-sm text-gray-500 mt-1">Beschreibung für Suchmaschinen (max. 160 Zeichen)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords
        </label>
        <input
          type="text"
          value={config.keywords.join(', ')}
          onChange={(e) => onUpdate({ keywords: e.target.value.split(',').map(k => k.trim()) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="spirituelle Beratung, Heilung, Meditation, Genesungsbegleitung"
        />
        <p className="text-sm text-gray-500 mt-1">Komma-getrennte Suchbegriffe</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-700 mb-2">SEO-Vorschau</h4>
        <div className="text-blue-600 text-lg">{config.metaTitle || 'Titel hier...'}</div>
        <div className="text-green-600 text-sm">www.ihre-domain.de</div>
        <div className="text-gray-600 text-sm mt-1">
          {config.metaDescription || 'Beschreibung hier...'}
        </div>
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-700">Website-Features aktivieren/deaktivieren</h4>
      
      <div className="space-y-4">
        {[
          { key: 'enableWordClouds', label: 'Word Clouds', desc: 'Spirituelle Word Cloud Galerie' },
          { key: 'enableBlog', label: 'Blog', desc: 'Artikel und Inspirationen' },
          { key: 'enableGallery', label: 'Galerie', desc: 'Bilder und Impressionen' },
          { key: 'enableContact', label: 'Kontakt', desc: 'Kontaktformular und Info' },
          { key: 'enableBooking', label: 'Terminbuchung', desc: 'Online Termine buchen' },
          { key: 'enableNewsletter', label: 'Newsletter', desc: 'E-Mail Newsletter Anmeldung' },
        ].map((feature) => (
          <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">{feature.label}</div>
              <div className="text-sm text-gray-500">{feature.desc}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config[feature.key as keyof SiteConfig] as boolean}
                onChange={(e) => onUpdate({ [feature.key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sub Tab Content */}
      <div>
        {activeSubTab === 'branding' && renderBrandingTab()}
        {activeSubTab === 'colors' && renderColorsTab()}
        {activeSubTab === 'typography' && renderTypographyTab()}
        {activeSubTab === 'layout' && renderLayoutTab()}
        {activeSubTab === 'seo' && renderSEOTab()}
        {activeSubTab === 'features' && renderFeaturesTab()}
        {/* Add other tabs as needed */}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          💾 Einstellungen speichern
        </button>
      </div>
    </div>
  );
};

// ===============================
// PAGE BUILDER COMPONENT
// ===============================

const PageBuilder: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Pages List */}
      <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Seiten</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            ➕ Neue Seite
          </button>
        </div>

        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedPage?.id === page.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-sm">{page.title}</div>
              <div className="text-xs text-gray-500">/{page.slug}</div>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${page.isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-500">
                  {page.isPublished ? 'Veröffentlicht' : 'Entwurf'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Editor */}
      <div className="col-span-6 bg-white rounded-lg border border-gray-200 p-4">
        {selectedPage ? (
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Seite bearbeiten: {selectedPage.title}</h3>
            {/* Page editor content */}
            <div className="space-y-4">
              <input
                type="text"
                value={selectedPage.title}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Seitentitel"
              />
              <input
                type="text"
                value={selectedPage.slug}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="URL-Pfad (slug)"
              />
              <textarea
                rows={10}
                value={selectedPage.content}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Seiteninhalt..."
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <p>Wählen Sie eine Seite zum Bearbeiten</p>
            </div>
          </div>
        )}
      </div>

      {/* Component Library */}
      <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Komponenten</h3>
        
        <div className="space-y-2">
          {[
            { type: 'hero', label: 'Hero Sektion', icon: '🌟' },
            { type: 'text', label: 'Text Block', icon: '📝' },
            { type: 'image', label: 'Bild', icon: '🖼️' },
            { type: 'wordcloud', label: 'Word Cloud', icon: '☁️' },
            { type: 'gallery', label: 'Galerie', icon: '🖼️' },
            { type: 'contact', label: 'Kontakt', icon: '📞' },
            { type: 'testimonials', label: 'Testimonials', icon: '💬' },
            { type: 'services', label: 'Leistungen', icon: '⚙️' },
          ].map((component) => (
            <div
              key={component.type}
              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              draggable
            >
              <div className="flex items-center space-x-2">
                <span>{component.icon}</span>
                <span className="text-sm font-medium">{component.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===============================
// MAIN ADMIN DASHBOARD
// ===============================

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    siteName: 'Mannar Spiritual Guidance',
    logoText: 'Mannar',
    primaryColor: '#8B5E3C',
    secondaryColor: '#D17C62',
    accentColor: '#F5E9DA',
    backgroundColor: '#FFFFFF',
    textColor: '#374151',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    fontSize: 'medium',
    layoutStyle: 'spiritual',
    headerStyle: 'fixed',
    footerStyle: 'minimal',
    metaTitle: 'Mannar - Spirituelle Genesungsbegleitung',
    metaDescription: 'Professionelle spirituelle Begleitung für Ihre persönliche Heilungsreise.',
    keywords: ['spirituelle Beratung', 'Heilung', 'Meditation', 'Genesungsbegleitung'],
    socialLinks: {},
    contactInfo: {},
    enableWordClouds: true,
    enableBlog: true,
    enableGallery: true,
    enableContact: true,
    enableBooking: false,
    enableNewsletter: true,
  });

  const { user } = useAuth();

  const tabs: DashboardTab[] = [
    {
      id: 'overview',
      label: 'Übersicht',
      icon: '📊',
      component: <OverviewPanel />,
    },
    {
      id: 'site-config',
      label: 'Website-Einstellungen',
      icon: '⚙️',
      component: (
        <SiteConfigPanel
          config={siteConfig}
          onUpdate={(updates) => setSiteConfig(prev => ({ ...prev, ...updates }))}
        />
      ),
    },
    {
      id: 'pages',
      label: 'Seiten verwalten',
      icon: '📄',
      component: <PageBuilder />,
    },
    {
      id: 'wordclouds',
      label: 'Word Clouds',
      icon: '☁️',
      component: <WordCloudManager />,
    },
    {
      id: 'media',
      label: 'Medien',
      icon: '🖼️',
      component: <MediaManager />,
    },
    {
      id: 'users',
      label: 'Benutzer',
      icon: '👥',
      component: <UserManager />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      component: <AnalyticsPanel />,
    },
    {
      id: 'backup',
      label: 'Backup & Export',
      icon: '💾',
      component: <BackupPanel />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                🛠️ Admin Dashboard
              </h1>
              <div className="text-sm text-gray-500">
                Willkommen, {user?.username}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                👁️ Website ansehen
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                🚀 Änderungen veröffentlichen
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Schnellaktionen</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  ➕ Neue Seite erstellen
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  ☁️ Word Cloud hinzufügen
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  📝 Blog-Artikel schreiben
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  🖼️ Bild hochladen
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===============================
// OVERVIEW PANEL
// ===============================

const OverviewPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Übersicht</h2>
        <p className="text-gray-600">
          Willkommen im umfassenden Website-Builder für Mannar's spirituelle Platform.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Aktive Seiten', value: '8', icon: '📄', color: 'blue' },
          { label: 'Word Clouds', value: '12', icon: '☁️', color: 'green' },
          { label: 'Besucher (30 Tage)', value: '1.2k', icon: '👥', color: 'purple' },
          { label: 'Kontaktanfragen', value: '24', icon: '📨', color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Letzte Aktivitäten</h3>
          <div className="space-y-3">
            {[
              { action: 'Seite "Über mich" aktualisiert', time: 'vor 2 Stunden', icon: '📝' },
              { action: 'Neue Word Cloud erstellt', time: 'vor 1 Tag', icon: '☁️' },
              { action: 'Logo hochgeladen', time: 'vor 2 Tagen', icon: '🖼️' },
              { action: 'Kontaktformular angepasst', time: 'vor 3 Tagen', icon: '📞' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Website-Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="font-medium text-green-800">Website Online</span>
              </div>
              <span className="text-green-600">✓</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="font-medium text-blue-800">SSL Zertifikat</span>
              </div>
              <span className="text-blue-600">✓</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="font-medium text-yellow-800">Backup ausstehend</span>
              </div>
              <span className="text-yellow-600">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Setup Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Setup-Assistent</h3>
        <p className="text-gray-600 mb-4">
          Vervollständigen Sie die Einrichtung Ihrer Website in wenigen Schritten:
        </p>
        
        <div className="space-y-3">
          {[
            { task: 'Logo und Branding konfigurieren', completed: false, link: 'site-config' },
            { task: 'Hauptseite gestalten', completed: false, link: 'pages' },
            { task: 'Kontaktinformationen hinzufügen', completed: false, link: 'site-config' },
            { task: 'Erste Word Cloud erstellen', completed: false, link: 'wordclouds' },
            { task: 'SEO-Einstellungen optimieren', completed: false, link: 'site-config' },
          ].map((step, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={step.completed}
                  className="rounded border-gray-300"
                  readOnly
                />
                <span className={step.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                  {step.task}
                </span>
              </div>
              <button
                onClick={() => setActiveTab(step.link)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Bearbeiten →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===============================
// WORD CLOUD MANAGER
// ===============================

const WordCloudManager: React.FC = () => {
  const [wordClouds, setWordClouds] = useState<WordCloud[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Word Cloud Verwaltung</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          ☁️ Neue Word Cloud erstellen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wordClouds.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">☁️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Noch keine Word Clouds erstellt
            </h3>
            <p className="text-gray-500 mb-6">
              Erstellen Sie Ihre erste spirituelle Word Cloud
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Erste Word Cloud erstellen
            </button>
          </div>
        ) : (
          wordClouds.map((wordCloud) => (
            <div key={wordCloud.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">{wordCloud.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{wordCloud.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {wordCloud.words?.length || 0} Wörter
                </span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Bearbeiten
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===============================
// MEDIA MANAGER
// ===============================

const MediaManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Medien Verwaltung</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          📁 Dateien hochladen
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Dateien hierher ziehen
        </h3>
        <p className="text-gray-500 mb-6">
          Oder klicken Sie um Bilder, Videos und Dokumente hochzuladen
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Dateien auswählen
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Placeholder for uploaded media */}
        <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-2xl">🖼️</span>
        </div>
      </div>
    </div>
  );
};

// ===============================
// USER MANAGER
// ===============================

const UserManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Benutzer Verwaltung</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          👤 Neuen Benutzer hinzufügen
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benutzer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rolle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Letzter Login
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Aktionen</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium">M</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Mannar</div>
                    <div className="text-sm text-gray-500">mannar@example.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Administrator
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Aktiv
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                vor 2 Stunden
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-700">Bearbeiten</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===============================
// ANALYTICS PANEL
// ===============================

const AnalyticsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Website Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="text-3xl text-blue-600 mb-2">1,234</div>
          <div className="text-sm font-medium text-blue-800">Seitenaufrufe</div>
          <div className="text-xs text-blue-600">+12% zu letztem Monat</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="text-3xl text-green-600 mb-2">567</div>
          <div className="text-sm font-medium text-green-800">Eindeutige Besucher</div>
          <div className="text-xs text-green-600">+8% zu letztem Monat</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <div className="text-3xl text-purple-600 mb-2">89</div>
          <div className="text-sm font-medium text-purple-800">Kontaktanfragen</div>
          <div className="text-xs text-purple-600">+23% zu letztem Monat</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Detaillierte Analytics verfügbar
        </h3>
        <p className="text-gray-500 mb-6">
          Verbinden Sie Google Analytics für detaillierte Einblicke
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Google Analytics einrichten
        </button>
      </div>
    </div>
  );
};

// ===============================
// BACKUP PANEL
// ===============================

const BackupPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Backup & Export</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Automatische Backups</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Täglich um 2:00 Uhr</span>
              <span className="text-green-600">✓ Aktiv</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Letzte Sicherung</span>
              <span className="text-sm font-medium">vor 6 Stunden</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Jetzt sichern
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Optionen</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              📄 Alle Seiten exportieren
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              ☁️ Word Clouds exportieren
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              🖼️ Medien exportieren
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              ⚙️ Einstellungen exportieren
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Wichtiger Hinweis</h3>
        <p className="text-yellow-700">
          Erstellen Sie regelmäßig Backups Ihrer Website-Daten. 
          Bei Fragen zum Backup-System kontaktieren Sie den Support.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;