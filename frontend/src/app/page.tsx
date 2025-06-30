import React, { useState, useEffect } from 'react';
import { ChevronDown, Heart, Star, Circle, Phone, Mail, Instagram, Facebook } from 'lucide-react';

// Simulierte Word Cloud Daten - später von Strapi API
const mockWordCloudData = {
  title: "Spirituelle Reise",
  words: [
    { text: "Achtsamkeit", weight: 8, color: "#8B5CF6", link: "/achtsamkeit" },
    { text: "Innere Ruhe", weight: 9, color: "#06B6D4", link: "/ruhe" },
    { text: "Heilung", weight: 7, color: "#10B981", link: "/heilung" },
    { text: "Transformation", weight: 10, color: "#F59E0B", link: "/transformation" },
    { text: "Bewusstsein", weight: 6, color: "#EF4444", link: "/bewusstsein" },
    { text: "Meditation", weight: 8, color: "#8B5CF6", link: "/meditation" },
    { text: "Energie", weight: 5, color: "#06B6D4", link: "/energie" },
    { text: "Balance", weight: 7, color: "#10B981", link: "/balance" },
    { text: "Spiritualität", weight: 9, color: "#F59E0B", link: "/spiritualitaet" },
    { text: "Selbstliebe", weight: 8, color: "#EF4444", link: "/selbstliebe" },
    { text: "Chakren", weight: 6, color: "#8B5CF6", link: "/chakren" },
    { text: "Licht", weight: 5, color: "#06B6D4", link: "/licht" },
    { text: "Vertrauen", weight: 7, color: "#10B981", link: "/vertrauen" },
    { text: "Harmonie", weight: 6, color: "#F59E0B", link: "/harmonie" },
    { text: "Intuition", weight: 8, color: "#EF4444", link: "/intuition" }
  ],
  backgroundColor: "#0F0F23",
  globalTextColor: "#FFFFFF"
};

// Word Cloud Component
const WordCloudDisplay: React.FC<{ data: typeof mockWordCloudData; className?: string }> = ({ data, className = "" }) => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  // Dynamische Positionierung basierend auf Gewichtung
  const getWordPosition = (index: number, weight: number) => {
    const positions = [
      { top: '20%', left: '15%' },
      { top: '10%', left: '45%' },
      { top: '25%', left: '70%' },
      { top: '45%', left: '20%' },
      { top: '35%', left: '50%' },
      { top: '55%', left: '75%' },
      { top: '70%', left: '10%' },
      { top: '65%', left: '40%' },
      { top: '80%', left: '65%' },
      { top: '15%', left: '80%' },
      { top: '50%', left: '85%' },
      { top: '75%', left: '85%' },
      { top: '85%', left: '25%' },
      { top: '30%', left: '85%' },
      { top: '60%', left: '5%' }
    ];
    return positions[index] || { top: '50%', left: '50%' };
  };

  return (
    <div className={`relative w-full h-full min-h-[600px] overflow-hidden ${className}`}
         style={{ backgroundColor: data.backgroundColor }}>
      {data.words.map((word, index) => {
        const position = getWordPosition(index, word.weight);
        const fontSize = Math.max(12, word.weight * 2.5);
        const isHovered = hoveredWord === word.text;
        
        return (
          <div
            key={word.text}
            className="absolute cursor-pointer transition-all duration-300 ease-out transform hover:scale-110"
            style={{
              top: position.top,
              left: position.left,
              transform: 'translate(-50%, -50%)',
              fontSize: `${fontSize}px`,
              color: word.color,
              textShadow: isHovered ? `0 0 20px ${word.color}` : `0 0 10px ${word.color}40`,
            }}
            onMouseEnter={() => setHoveredWord(word.text)}
            onMouseLeave={() => setHoveredWord(null)}
            onClick={() => word.link && window.open(word.link, '_blank')}
          >
            <span className="font-semibold whitespace-nowrap select-none">
              {word.text}
            </span>
          </div>
        );
      })}
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 opacity-20">
        <Heart className="w-8 h-8 text-purple-300" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20">
        <Star className="w-6 h-6 text-cyan-300" />
      </div>
      <div className="absolute top-1/3 left-5 opacity-15">
        <Circle className="w-4 h-4 text-green-300" />
      </div>
    </div>
  );
};

// Main Homepage Component
const MannarHomepage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Logo verschwindet nach 200px scrollen
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hero Section - Logo Only */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Logo Container */}
        <div 
          className="text-center transform transition-all duration-1000 ease-out"
          style={{
            opacity: scrollY > 100 ? 0 : 1,
            transform: `translateY(${scrollY * 0.5}px) scale(${1 - scrollY * 0.001})`
          }}
        >
          {/* Main Logo/Title */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-thin text-white/90 tracking-wider mb-4">
              MANNAR
            </h1>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white/70 font-light tracking-wide">
              Spirituelle Begleitung
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-16">
            <button 
              onClick={scrollToContent}
              className="group flex flex-col items-center space-y-2 hover:text-purple-300 transition-colors duration-300"
            >
              <span className="text-white/60 text-sm uppercase tracking-widest">
                Entdecken
              </span>
              <ChevronDown className="w-6 h-6 text-white/60 group-hover:text-purple-300 transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </section>

      {/* Main Content Section */}
      <section className="relative min-h-screen bg-slate-900">
        {/* Introduction */}
        <div 
          className={`container mx-auto px-6 py-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* About Mannar */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
              Willkommen auf deiner spirituellen Reise
            </h2>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Ich bin Mannar, deine Begleiterin auf dem Weg zu innerem Frieden, 
              Selbsterkenntnis und spirituellem Wachstum. Gemeinsam entdecken wir 
              die Kraft deiner Seele und finden Balance in deinem Leben.
            </p>
            <div className="flex justify-center space-x-8 text-purple-300">
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">Herzensarbeit</span>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">Transformation</span>
              </div>
              <div className="text-center">
                <Circle className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">Ganzheitlichkeit</span>
              </div>
            </div>
          </div>

          {/* Word Cloud Section - Main Attraction */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-light text-white mb-4">
                Deine spirituelle Landkarte
              </h3>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Entdecke die verschiedenen Aspekte deiner spirituellen Reise. 
                Jedes Wort repräsentiert einen Baustein auf deinem Weg zur Selbsterkenntnis.
              </p>
            </div>
            
            {/* Word Cloud Container */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/10">
              <WordCloudDisplay data={mockWordCloudData} />
            </div>
          </div>

          {/* Services Preview */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center hover:bg-slate-800/50 transition-all duration-300">
              <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-light text-white mb-3">Einzelsitzungen</h4>
              <p className="text-white/70">
                Persönliche spirituelle Begleitung in einem geschützten Raum
              </p>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center hover:bg-slate-800/50 transition-all duration-300">
              <Star className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-xl font-light text-white mb-3">Meditation</h4>
              <p className="text-white/70">
                Geführte Meditationen für innere Ruhe und Klarheit
              </p>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center hover:bg-slate-800/50 transition-all duration-300">
              <Circle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-light text-white mb-3">Energiearbeit</h4>
              <p className="text-white/70">
                Harmonisierung und Balance deiner Lebensenergie
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h3 className="text-3xl font-light text-white mb-8">
              Bereit für deine Reise?
            </h3>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Kontaktiere mich für ein unverbindliches Gespräch und lass uns gemeinsam 
              den ersten Schritt auf deinem spirituellen Weg gehen.
            </p>
            
            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <a 
                href="tel:+41-xxx-xxx-xxxx"
                className="flex items-center space-x-3 bg-purple-600/20 hover:bg-purple-600/30 backdrop-blur-sm border border-purple-400/30 rounded-full px-8 py-4 text-white transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span>Anrufen</span>
              </a>
              
              <a 
                href="mailto:kontakt@mannar.ch"
                className="flex items-center space-x-3 bg-cyan-600/20 hover:bg-cyan-600/30 backdrop-blur-sm border border-cyan-400/30 rounded-full px-8 py-4 text-white transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>E-Mail schreiben</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-white/60 hover:text-purple-400 transition-colors duration-300">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/60 hover:text-purple-400 transition-colors duration-300">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <h4 className="text-2xl font-light text-white mb-2">MANNAR</h4>
            <p className="text-white/60">Spirituelle Begleitung mit Herz</p>
          </div>
          <div className="text-white/40 text-sm">
            <p>&copy; 2024 Mannar. Alle Rechte vorbehalten.</p>
            <p className="mt-2">Zürich, Schweiz</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MannarHomepage;