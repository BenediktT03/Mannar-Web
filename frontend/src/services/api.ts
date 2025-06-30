// src/services/api.ts
// 🚀 ENHANCED API SERVICE - VOLLSTÄNDIG NEU IMPLEMENTIERT
// Professionelles API Management mit JWT Authentication, Error Handling und SSR-Kompatibilität

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// ===============================
// TYPESCRIPT INTERFACES
// ===============================

// Word Cloud Types
export interface Word {
  id: string;
  text: string;
  weight: number;
  color: string;
  link?: string;
  description?: string;
}

export interface WordCloud {
  id: string;
  title: string;
  description: string;
  words: Word[];
  backgroundColor: string;
  textColor: string;
  hoverColor: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface WordCloudResponse extends ApiResponse<WordCloud> {}
export interface WordCloudsResponse extends ApiResponse<WordCloud[]> {}

// Authentication Types
export interface LoginCredentials {
  identifier: string; // username or email
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
}

export interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// ===============================
// API CONFIGURATION
// ===============================

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Environment-based API URL mit Fallback
    this.baseURL = this.getApiUrl();
    
    // Axios Instance mit optimaler Konfiguration
    this.api = axios.create({
      baseURL: `${this.baseURL}/api`,
      timeout: 15000, // 15 Sekunden Timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request Interceptor für Authentication
    this.setupRequestInterceptor();
    
    // Response Interceptor für Error Handling
    this.setupResponseInterceptor();
  }

  // ===============================
  // PRIVATE HELPER METHODS
  // ===============================

  /**
   * Ermittelt die API URL basierend auf Environment
   * SSR-kompatible Implementation
   */
  private getApiUrl(): string {
    // Server-Side: Environment Variable verwenden
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    }
    
    // Client-Side: Next.js Public Environment Variable
    return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  }

  /**
   * Holt JWT Token aus localStorage (SSR-safe)
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null; // Server-side hat keine localStorage
    }
    
    try {
      return localStorage.getItem('strapiToken');
    } catch (error) {
      console.warn('⚠️ localStorage access failed:', error);
      return null;
    }
  }

  /**
   * Speichert Auth Data in localStorage (SSR-safe)
   */
  private saveAuthData(jwt: string, user: AuthUser): void {
    if (typeof window === 'undefined') {
      console.warn('⚠️ Cannot save auth data on server-side');
      return;
    }

    try {
      localStorage.setItem('strapiToken', jwt);
      localStorage.setItem('strapiUser', JSON.stringify(user));
      console.log('✅ Auth data saved successfully');
    } catch (error) {
      console.error('❌ Failed to save auth data:', error);
    }
  }

  /**
   * Entfernt Auth Data aus localStorage
   */
  private clearAuthData(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem('strapiToken');
      localStorage.removeItem('strapiUser');
      console.log('✅ Auth data cleared');
    } catch (error) {
      console.error('❌ Failed to clear auth data:', error);
    }
  }

  /**
   * Setup Request Interceptor für automatische JWT Headers
   */
  private setupRequestInterceptor(): void {
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Request sent with JWT token');
        } else {
          console.log('📡 Request sent without authentication');
        }

        // Debug Info für Development
        if (process.env.NODE_ENV === 'development') {
          console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Setup Response Interceptor für Error Handling
   */
  private setupResponseInterceptor(): void {
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Success Response Logging
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error: AxiosError) => {
        const apiError = this.handleApiError(error);
        
        // Auto-Logout bei 401 Unauthorized
        if (apiError.status === 401) {
          console.warn('🚫 Unauthorized - clearing auth data');
          this.clearAuthData();
          
          // Optional: Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Konvertiert Axios Error zu standardisiertem API Error
   */
  private handleApiError(error: AxiosError): ApiError {
    console.error('🚨 API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      return {
        message: data?.error?.message || data?.message || `HTTP ${status} Error`,
        status,
        code: data?.error?.name || 'API_ERROR',
        details: data?.error?.details || data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Netzwerkfehler - Server nicht erreichbar',
        status: 0,
        code: 'NETWORK_ERROR',
        details: error.message,
      };
    } else {
      // Request setup error
      return {
        message: error.message || 'Unbekannter Fehler',
        status: 0,
        code: 'REQUEST_ERROR',
        details: error,
      };
    }
  }

  // ===============================
  // AUTHENTICATION METHODS
  // ===============================

  /**
   * User Login mit Credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login for:', credentials.identifier);
      
      const response = await this.api.post<AuthResponse>('/auth/local', credentials);
      const { jwt, user } = response.data;

      // Auth Data speichern
      this.saveAuthData(jwt, user);
      
      console.log('✅ Login successful for user:', user.username);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  /**
   * User Logout
   */
  async logout(): Promise<void> {
    try {
      this.clearAuthData();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  /**
   * Überprüft ob User eingeloggt ist
   */
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  /**
   * Holt aktuellen User aus localStorage
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const userStr = localStorage.getItem('strapiUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ Failed to get current user:', error);
      return null;
    }
  }

  // ===============================
  // WORD CLOUD METHODS
  // ===============================

  /**
   * Alle Word Clouds laden
   */
  async getAllWordClouds(): Promise<WordCloud[]> {
    try {
      console.log('📡 Loading all word clouds...');
      
      const response = await this.api.get<WordCloudsResponse>('/word-clouds?populate=*');
      
      console.log('✅ Loaded word clouds:', response.data.data.length);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to load word clouds:', error);
      throw error;
    }
  }

  /**
   * Einzelne Word Cloud laden
   */
  async getWordCloud(id: string): Promise<WordCloud> {
    try {
      console.log('📡 Loading word cloud:', id);
      
      const response = await this.api.get<WordCloudResponse>(`/word-clouds/${id}?populate=*`);
      
      console.log('✅ Word cloud loaded:', response.data.data.title);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to load word cloud:', error);
      throw error;
    }
  }

  /**
   * Neue Word Cloud erstellen
   */
  async createWordCloud(wordCloudData: Partial<WordCloud>): Promise<WordCloud> {
    try {
      console.log('📡 Creating word cloud:', wordCloudData.title);
      
      const response = await this.api.post<WordCloudResponse>('/word-clouds', {
        data: wordCloudData,
      });
      
      console.log('✅ Word cloud created:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to create word cloud:', error);
      throw error;
    }
  }

  /**
   * Word Cloud aktualisieren
   */
  async updateWordCloud(id: string, wordCloudData: Partial<WordCloud>): Promise<WordCloud> {
    try {
      console.log('📡 Updating word cloud:', id);
      
      const response = await this.api.put<WordCloudResponse>(`/word-clouds/${id}`, {
        data: wordCloudData,
      });
      
      console.log('✅ Word cloud updated:', response.data.data.title);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to update word cloud:', error);
      throw error;
    }
  }

  /**
   * Word Cloud löschen
   */
  async deleteWordCloud(id: string): Promise<void> {
    try {
      console.log('📡 Deleting word cloud:', id);
      
      await this.api.delete(`/word-clouds/${id}`);
      
      console.log('✅ Word cloud deleted');
    } catch (error) {
      console.error('❌ Failed to delete word cloud:', error);
      throw error;
    }
  }

  // ===============================
  // LEGACY METHODS (für Abwärtskompatibilität)
  // ===============================

  /**
   * @deprecated Use getAllWordClouds() instead
   * Behält Kompatibilität mit bestehender Angebot-API
   */
  async getAllAngebote(): Promise<any> {
    console.warn('⚠️ getAllAngebote() is deprecated. Use getAllWordClouds() instead.');
    
    try {
      const response = await this.api.get('/angebots');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to load angebote:', error);
      throw error;
    }
  }

  /**
   * @deprecated Use getWordCloud() instead
   */
  async getAngebotBySlug(slug: string): Promise<any> {
    console.warn('⚠️ getAngebotBySlug() is deprecated. Use getWordCloud() instead.');
    
    try {
      const response = await this.api.get(`/angebots?filters[slug][$eq]=${slug}`);
      
      if (response.data.data.length === 0) {
        throw new Error('Angebot nicht gefunden');
      }
      
      return {
        data: response.data.data[0],
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('❌ Failed to load angebot:', error);
      throw error;
    }
  }
}

// ===============================
// SINGLETON EXPORT
// ===============================

// Singleton Pattern für globale API Instance
const apiService = new ApiService();

// Named Exports für spezifische Funktionen
export const {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getAllWordClouds,
  getWordCloud,
  createWordCloud,
  updateWordCloud,
  deleteWordCloud,
  getAllAngebote, // Deprecated
  getAngebotBySlug, // Deprecated
} = apiService;

// Default Export der API Service Class
export default apiService;