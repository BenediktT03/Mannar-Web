// src/types/index.ts
// 🔷 COMPREHENSIVE TYPESCRIPT TYPES - 100% TYPE-SAFE

// ===============================
// WORD CLOUD TYPES
// ===============================

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

export interface WordCloudPayload extends Omit<WordCloud, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

// ===============================
// API RESPONSE TYPES
// ===============================

export interface StrapiResponse<T> {
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

export interface WordCloudResponse extends StrapiResponse<WordCloud> {}
export interface WordCloudsResponse extends StrapiResponse<WordCloud[]> {}

// ===============================
// AUTHENTICATION TYPES
// ===============================

export interface LoginCredentials {
  identifier: string;
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

// ===============================
// ERROR TYPES
// ===============================

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// ===============================
// COMPONENT PROPS TYPES
// ===============================

export interface WordCloudComponentProps {
  wordCloud: WordCloud;
  isEditable?: boolean;
  isPreview?: boolean;
  className?: string;
  onWordClick?: (word: Word) => void;
  onWordHover?: (word: Word) => void;
}

export interface LiveWordCloudEditorProps {
  initialWordCloud?: WordCloud;
  onSave: (wordCloud: WordCloudPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface AdminDashboardProps {
  user: AuthUser;
  wordClouds?: WordCloud[];
  onNavigate?: (route: string) => void;
}

// ===============================
// HOOK TYPES
// ===============================

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export interface UseWordCloudsReturn {
  wordClouds: WordCloud[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (wordCloud: WordCloudPayload) => Promise<WordCloud>;
  update: (id: string, wordCloud: Partial<WordCloud>) => Promise<WordCloud>;
  delete: (id: string) => Promise<void>;
}

// ===============================
// FORM TYPES
// ===============================

export interface LoginFormState {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface WordFormState {
  text: string;
  weight: number;
  color: string;
  link: string;
  description: string;
}

// ===============================
// LEGACY TYPES (für Kompatibilität)
// ===============================

export interface Angebot {
  id: string;
  titel: string;
  beschreibung: string;
  preis: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface AngeboteResponse extends StrapiResponse<Angebot[]> {}
export interface AngebotResponse extends StrapiResponse<Angebot> {}

// ===============================
// TYPE GUARDS
// ===============================

export function isWord(obj: any): obj is Word {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.weight === 'number' &&
    typeof obj.color === 'string'
  );
}

export function isWordCloud(obj: any): obj is WordCloud {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.words) &&
    obj.words.every(isWord)
  );
}

export function isAuthUser(obj: any): obj is AuthUser {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.confirmed === 'boolean' &&
    typeof obj.blocked === 'boolean'
  );
}