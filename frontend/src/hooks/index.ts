// src/hooks/index.ts
// 🎯 CUSTOM REACT HOOKS - Professional State Management

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import type {
  AuthUser,
  LoginCredentials,
  WordCloud,
  WordCloudPayload,
  UseAuthReturn,
  UseWordCloudsReturn,
  ApiError,
} from '@/types';

// ===============================
// AUTHENTICATION HOOK
// ===============================

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isInitialized = useRef(false);

  // Initial Auth Check (nur client-side)
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) {
      return;
    }

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already logged in
        if (apiService.isAuthenticated()) {
          const currentUser = apiService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            console.log('✅ User restored from localStorage:', currentUser.username);
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        setError('Fehler beim Laden der Authentifizierung');
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    initializeAuth();
  }, []);

  // Login Function
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔐 Attempting login...');
      const response = await apiService.login(credentials);
      
      setUser(response.user);
      console.log('✅ Login successful:', response.user.username);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login fehlgeschlagen';
      setError(errorMessage);
      console.error('❌ Login failed:', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout Function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await apiService.logout();
      setUser(null);
      
      console.log('✅ Logout successful');
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout fehlgeschlagen';
      setError(errorMessage);
      console.error('❌ Logout failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Clear Error Function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
    clearError,
  };
}

// ===============================
// WORD CLOUDS HOOK
// ===============================

export function useWordClouds(): UseWordCloudsReturn {
  const [wordClouds, setWordClouds] = useState<WordCloud[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Initial Load
  useEffect(() => {
    if (!isInitialized.current) {
      refresh();
      isInitialized.current = true;
    }
  }, []);

  // Refresh Function
  const refresh = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📡 Loading word clouds...');
      const data = await apiService.getAllWordClouds();
      
      setWordClouds(data);
      console.log('✅ Word clouds loaded:', data.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fehler beim Laden der Word Clouds';
      setError(errorMessage);
      console.error('❌ Failed to load word clouds:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create Function mit Optimistic Update
  const create = useCallback(async (wordCloudData: WordCloudPayload): Promise<WordCloud> => {
    try {
      setError(null);
      
      console.log('📝 Creating word cloud:', wordCloudData.title);
      const newWordCloud = await apiService.createWordCloud(wordCloudData);
      
      // Optimistic Update
      setWordClouds(prev => [newWordCloud, ...prev]);
      
      console.log('✅ Word cloud created:', newWordCloud.id);
      return newWordCloud;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fehler beim Erstellen der Word Cloud';
      setError(errorMessage);
      console.error('❌ Failed to create word cloud:', errorMessage);
      throw error;
    }
  }, []);

  // Update Function mit Optimistic Update
  const update = useCallback(async (id: string, wordCloudData: Partial<WordCloud>): Promise<WordCloud> => {
    try {
      setError(null);
      
      // Optimistic Update
      setWordClouds(prev => 
        prev.map(wc => 
          wc.id === id 
            ? { ...wc, ...wordCloudData, updatedAt: new Date().toISOString() }
            : wc
        )
      );
      
      console.log('📝 Updating word cloud:', id);
      const updatedWordCloud = await apiService.updateWordCloud(id, wordCloudData);
      
      // Replace optimistic update with real data
      setWordClouds(prev => 
        prev.map(wc => wc.id === id ? updatedWordCloud : wc)
      );
      
      console.log('✅ Word cloud updated:', updatedWordCloud.title);
      return updatedWordCloud;
    } catch (error) {
      // Revert optimistic update on error
      refresh();
      
      const errorMessage = error instanceof Error ? error.message : 'Fehler beim Aktualisieren der Word Cloud';
      setError(errorMessage);
      console.error('❌ Failed to update word cloud:', errorMessage);
      throw error;
    }
  }, [refresh]);

  // Delete Function mit Optimistic Update
  const deleteWordCloud = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      
      // Optimistic Update
      const originalWordClouds = wordClouds;
      setWordClouds(prev => prev.filter(wc => wc.id !== id));
      
      console.log('🗑️ Deleting word cloud:', id);
      await apiService.deleteWordCloud(id);
      
      console.log('✅ Word cloud deleted');
    } catch (error) {
      // Revert optimistic update on error
      setWordClouds(wordClouds);
      
      const errorMessage = error instanceof Error ? error.message : 'Fehler beim Löschen der Word Cloud';
      setError(errorMessage);
      console.error('❌ Failed to delete word cloud:', errorMessage);
      throw error;
    }
  }, [wordClouds]);

  return {
    wordClouds,
    isLoading,
    error,
    refresh,
    create,
    update,
    delete: deleteWordCloud,
  };
}

// ===============================
// DEBOUNCE HOOK
// ===============================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ===============================
// FORM VALIDATION HOOK
// ===============================

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Set Field Value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field
    const error = validationRules[field]?.(value);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  }, [validationRules]);

  // Set Field Touched
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Validate All Fields
  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field as keyof T](values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [values, validationRules]);

  // Reset Form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// ===============================
// NOTIFICATIONS HOOK
// ===============================

export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>>([]);

  const addNotification = useCallback((notification: Omit<typeof notifications[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove nach duration
    if (notification.duration !== 0) {
      window.setTimeout(() => {
  removeNotification(id);
}, notification.duration || 5000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience Methods
  const success = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration });
  }, [addNotification]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration });
  }, [addNotification]);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration });
  }, [addNotification]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
}

// ===============================
// EXPORTS
// ===============================

export default {
  useAuth,
  useWordClouds,
  useDebounce,
  useFormValidation,
  useNotifications,
};