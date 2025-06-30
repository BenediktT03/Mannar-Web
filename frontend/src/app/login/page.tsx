// src/app/login/page.tsx
// 🔐 LOGIN PAGE - User Authentication

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';
import type { LoginCredentials } from '@/types';

// ===============================
// LOGIN FORM COMPONENT
// ===============================

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear auth errors when component unmounts or form changes
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'E-Mail oder Benutzername ist erforderlich';
    } else if (formData.identifier.includes('@')) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.identifier)) {
        newErrors.identifier = 'Ungültige E-Mail-Adresse';
      }
    } else if (formData.identifier.length < 3) {
      newErrors.identifier = 'Benutzername muss mindestens 3 Zeichen haben';
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen haben';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    clearError();

    try {
      await login(formData);
      // Redirect will happen automatically via useEffect
    } catch (error) {
      console.error('Login failed:', error);
      // Error will be shown via authError
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear auth error when user modifies form
    if (authError) {
      clearError();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Willkommen zurück!
          </h1>
          <p className="text-gray-600">
            Melde dich an, um deine Word Clouds zu verwalten
          </p>
        </div>

        {/* Error Display */}
        {authError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700 text-sm font-medium">
                {authError}
              </span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username Field */}
          <div>
            <label 
              htmlFor="identifier" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              E-Mail oder Benutzername
            </label>
            <input
              id="identifier"
              type="text"
              value={formData.identifier}
              onChange={(e) => handleInputChange('identifier', e.target.value)}
              placeholder="max@example.com oder maxmuster"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
              autoComplete="username"
              required
            />
            {errors.identifier && (
              <p className="mt-2 text-sm text-red-600">
                {errors.identifier}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Passwort
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Dein Passwort"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-gray-700">
                Angemeldet bleiben
              </span>
            </label>
            
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Passwort vergessen?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Anmelden...
              </>
            ) : (
              '🚀 Anmelden'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">oder</span>
            </div>
          </div>
        </div>

        {/* Social Login (Optional) */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            <span className="mr-2">🌐</span>
            Mit Google anmelden
          </button>
          
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            <span className="mr-2">👤</span>
            Mit GitHub anmelden
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Noch kein Konto?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ===============================
// TESTIMONIALS COMPONENT
// ===============================

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      text: "WordClouds hat unsere Präsentationen revolutioniert. Einfach zu bedienen und wunderschöne Ergebnisse!",
      author: "Sarah M.",
      role: "Marketing Managerin"
    },
    {
      text: "Der beste Word Cloud Editor, den ich je verwendet habe. Professionell und intuitiv.",
      author: "Dr. Michael K.",
      role: "Forscher"
    },
    {
      text: "Perfekt für unsere Workshops. Die interaktiven Features begeistern unsere Teilnehmer.",
      author: "Lisa T.",
      role: "Workshop Leiterin"
    }
  ];

  return (
    <div className="hidden lg:block">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Was unsere Nutzer sagen
      </h3>
      
      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">⭐</span>
              ))}
            </div>
            
            <blockquote className="text-gray-700 mb-4 italic">
              "{testimonial.text}"
            </blockquote>
            
            <div className="text-right">
              <div className="font-semibold text-gray-900">{testimonial.author}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===============================
// MAIN LOGIN PAGE COMPONENT
// ===============================

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Login Form */}
          <div className="order-2 lg:order-1">
            <ComponentErrorBoundary componentName="Login Form">
              <LoginForm />
            </ComponentErrorBoundary>
          </div>

          {/* Right Side - Testimonials & Features */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Features Preview */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Deine Word Clouds warten auf dich! ☁️
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Erstelle, bearbeite und teile wunderschöne Word Clouds mit unserem 
                professionellen Editor.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-semibold text-gray-900">Live Editor</div>
                  <div className="text-sm text-gray-600">Real-time Vorschau</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="font-semibold text-gray-900">Interaktiv</div>
                  <div className="text-sm text-gray-600">Klickbare Links</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-semibold text-gray-900">Responsive</div>
                  <div className="text-sm text-gray-600">Alle Geräte</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">☁️</div>
                  <div className="font-semibold text-gray-900">Cloud Sync</div>
                  <div className="text-sm text-gray-600">Überall verfügbar</div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <ComponentErrorBoundary componentName="Testimonials">
              <Testimonials />
            </ComponentErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;