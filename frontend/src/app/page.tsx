// src/app/page.tsx
// 🕉️ MANNAR'S SPIRITUAL HOMEPAGE - Genesungsbegleitung

'use client';

import React, { useState, useEffect } from 'react';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';

// ===============================
// TYPES & INTERFACES
// ===============================

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// ===============================
// SPIRITUAL WORD CLOUD DATA
// ===============================

const spiritualWords = [
  { text: 'Heilung', weight: 8, color: '#8B5E3C' },
  { text: 'Vertrauen', weight: 7, color: '#D17C62' },
  { text: 'Würde', weight: 6, color: '#8B5E3C' },
  { text: 'Verbindung', weight: 9, color: '#D17C62' },
  { text: 'Selbstbestimmung', weight: 8, color: '#8B5E3C' },
  { text: 'Empathie', weight: 7, color: '#D17C62' },
  { text: 'Achtsamkeit', weight: 6, color: '#8B5E3C' },
  { text: 'Transformation', weight: 8, color: '#D17C62' },
  { text: 'Mitgefühl', weight: 5, color: '#8B5E3C' },
  { text: 'Hoffnung', weight: 7, color: '#D17C62' },
];

// ===============================
// ANIMATED LOGO COMPONENT
// ===============================

const AnimatedLogo: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        {/* M Logo - Initial State */}
        <div
          className={`transition-all duration-1000 ease-in-out ${
            isRevealed ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
          style={{
            position: isRevealed ? 'absolute' : 'relative',
            top: isRevealed ? '50%' : '0',
            left: isRevealed ? '50%' : '0',
            transform: isRevealed ? 'translate(-50%, -50%)' : 'translate(0, 0)',
          }}
        >
          <div className="text-8xl md:text-9xl font-serif text-[#8B5E3C] animate-pulse">
            M
          </div>
        </div>

        {/* Mannar Text - Revealed State */}
        <div
          className={`transition-all duration-1000 ease-in-out delay-500 ${
            isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <h1 className="text-6xl md:text-7xl font-serif text-[#8B5E3C] tracking-wide">
            Mannar
          </h1>
        </div>
      </div>
    </div>
  );
};

// ===============================
// SPIRITUAL WORD CLOUD COMPONENT
// ===============================

const SpiritualWordCloud: React.FC = () => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center space-y-4">
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {spiritualWords.map((word, index) => (
            <span
              key={index}
              className="inline-block transition-all duration-300 ease-in-out cursor-default"
              style={{
                fontSize: `${1 + (word.weight / 10) * 1.5}rem`,
                color: word.color,
                fontWeight: 300 + word.weight * 50,
                transform: hoveredWord === word.text ? 'scale(1.2)' : 'scale(1)',
                textShadow: hoveredWord === word.text ? '0 2px 8px rgba(139, 94, 60, 0.3)' : 'none',
              }}
              onMouseEnter={() => setHoveredWord(word.text)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {word.text}
            </span>
          ))}
        </div>
        
        <div className="mt-8 text-lg text-[#8B5E3C]/70 font-light tracking-wide">
          Genesungsbegleitung · Spirituelle Führung · Persönliche Transformation
        </div>
      </div>
    </div>
  );
};

// ===============================
// SIDEBAR COMPONENT
// ===============================

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
    alert('Vielen Dank für Ihre Nachricht! Ich melde mich zeitnah bei Ihnen.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-gradient-to-b from-[#F5E9DA] to-[#E0DDD8] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 transition-colors"
        >
          <span className="text-[#8B5E3C] text-xl">×</span>
        </button>

        <div className="p-6 pt-16 space-y-8">
          {/* Über mich */}
          <section>
            <button
              onClick={() => setActiveSection(activeSection === 'about' ? '' : 'about')}
              className="w-full text-left text-xl font-serif text-[#8B5E3C] mb-4 hover:text-[#D17C62] transition-colors"
            >
              Über mich ✨
            </button>
            
            {activeSection === 'about' && (
              <div className="space-y-4 text-[#8B5E3C]/80 leading-relaxed animate-fadeIn">
                <p className="font-medium text-[#8B5E3C]">
                  Manuel "Mannar" Balldisin
                </p>
                <p>
                  Als Genesungsbegleiter unterstütze ich Menschen dabei, ihre innere Stärke 
                  wiederzufinden und einen Weg aus persönlichen Krisen zu entwickeln.
                </p>
                <p>
                  Meine eigene Heilungsreise und professionelle Ausbildung ermöglichen es mir, 
                  mit echter Empathie und bewährten Methoden zu begleiten.
                </p>
                <div className="bg-[#8B5E3C]/5 p-4 rounded-lg">
                  <p className="text-sm italic">
                    "Jeder Mensch trägt die Kraft zur Heilung bereits in sich. 
                    Manchmal braucht es nur jemanden, der daran glaubt."
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Angebote */}
          <section>
            <button
              onClick={() => setActiveSection(activeSection === 'services' ? '' : 'services')}
              className="w-full text-left text-xl font-serif text-[#8B5E3C] mb-4 hover:text-[#D17C62] transition-colors"
            >
              Angebote & Leistungen 🌱
            </button>
            
            {activeSection === 'services' && (
              <div className="space-y-4 text-[#8B5E3C]/80 animate-fadeIn">
                <div className="space-y-3">
                  <div className="border-l-2 border-[#D17C62] pl-4">
                    <h4 className="font-medium text-[#8B5E3C]">Einzelbegleitung</h4>
                    <p className="text-sm">Persönliche 1:1 Gespräche zur individuellen Unterstützung</p>
                  </div>
                  
                  <div className="border-l-2 border-[#D17C62] pl-4">
                    <h4 className="font-medium text-[#8B5E3C]">Gruppencoachings</h4>
                    <p className="text-sm">Workshops und Gruppensessions für gemeinsame Heilung</p>
                  </div>
                  
                  <div className="border-l-2 border-[#D17C62] pl-4">
                    <h4 className="font-medium text-[#8B5E3C]">Online & Präsenz</h4>
                    <p className="text-sm">Flexible Termine - vor Ort oder digital</p>
                  </div>
                </div>
                
                <div className="bg-[#D17C62]/10 p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium text-[#8B5E3C] mb-2">Testimonials</p>
                  <p className="text-xs italic text-[#8B5E3C]/70">
                    "Mannar hat mir geholfen, wieder Vertrauen in mich selbst zu finden." - Sarah M.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Kontakt */}
          <section>
            <button
              onClick={() => setActiveSection(activeSection === 'contact' ? '' : 'contact')}
              className="w-full text-left text-xl font-serif text-[#8B5E3C] mb-4 hover:text-[#D17C62] transition-colors"
            >
              Kontakt 🤝
            </button>
            
            {activeSection === 'contact' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-[#8B5E3C]/5 p-4 rounded-lg mb-4">
                  <p className="text-sm text-[#8B5E3C] font-medium mb-2">
                    🌟 Kostenloses Erstgespräch
                  </p>
                  <p className="text-xs text-[#8B5E3C]/70">
                    Lernen Sie mich kennen und entscheiden Sie in Ruhe, 
                    ob eine Zusammenarbeit für Sie passend ist.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ihr Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/70 border border-[#8B5E3C]/20 rounded-lg focus:ring-2 focus:ring-[#D17C62] focus:border-[#D17C62] transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Ihre E-Mail"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/70 border border-[#8B5E3C]/20 rounded-lg focus:ring-2 focus:ring-[#D17C62] focus:border-[#D17C62] transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Ihre Nachricht..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/70 border border-[#8B5E3C]/20 rounded-lg focus:ring-2 focus:ring-[#D17C62] focus:border-[#D17C62] transition-colors resize-none"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#8B5E3C] text-[#F5E9DA] py-3 rounded-lg font-medium hover:bg-[#D17C62] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Nachricht senden 💌
                  </button>
                </form>
                
                {/* Social Media */}
                <div className="flex justify-center space-x-4 pt-4 border-t border-[#8B5E3C]/10">
                  <a href="#" className="text-[#8B5E3C]/60 hover:text-[#D17C62] transition-colors">
                    📧
                  </a>
                  <a href="#" className="text-[#8B5E3C]/60 hover:text-[#D17C62] transition-colors">
                    📱
                  </a>
                  <a href="#" className="text-[#8B5E3C]/60 hover:text-[#D17C62] transition-colors">
                    🌐
                  </a>
                </div>
                
                {/* Legal Links */}
                <div className="text-center pt-4 border-t border-[#8B5E3C]/10">
                  <div className="space-x-4 text-xs text-[#8B5E3C]/50">
                    <a href="#" className="hover:text-[#D17C62] transition-colors">Impressum</a>
                    <span>·</span>
                    <a href="#" className="hover:text-[#D17C62] transition-colors">Datenschutz</a>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

// ===============================
// ANIMATED BACKGROUND COMPONENT
// ===============================

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#F5E9DA] via-[#E0DDD8] to-[#F5E9DA]"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradientShift 20s ease infinite',
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#8B5E3C' : '#D17C62'} 0%, transparent 70%)`,
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

// ===============================
// MAIN HOMEPAGE COMPONENT
// ===============================

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Taskbar Icon */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 right-6 z-30 w-12 h-12 bg-[#8B5E3C]/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#8B5E3C]/20 transition-all duration-300 hover:scale-110 group"
      >
        <div className="space-y-1.5">
          <div className="w-5 h-0.5 bg-[#8B5E3C] transition-transform group-hover:rotate-12"></div>
          <div className="w-5 h-0.5 bg-[#8B5E3C]"></div>
          <div className="w-5 h-0.5 bg-[#8B5E3C] transition-transform group-hover:-rotate-12"></div>
        </div>
      </button>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Animated Logo */}
          <ComponentErrorBoundary componentName="Animated Logo">
            <AnimatedLogo />
          </ComponentErrorBoundary>

          {/* Spiritual Word Cloud */}
          <ComponentErrorBoundary componentName="Spiritual Word Cloud">
            <SpiritualWordCloud />
          </ComponentErrorBoundary>
        </div>
      </main>

      {/* Sidebar */}
      <ComponentErrorBoundary componentName="Sidebar">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </ComponentErrorBoundary>
    </div>
  );
};

export default HomePage;