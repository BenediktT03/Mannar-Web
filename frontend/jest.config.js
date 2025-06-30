// ===============================
// COMPREHENSIVE TEST SUITE SETUP
// ===============================

// jest.config.js
// 🧪 Jest Configuration für das Mannar-Web Projekt

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js app directory bereitstellen für Jest
  dir: './',
});

// Jest Konfiguration
const customJestConfig = {
  // Test Environment
  testEnvironment: 'jsdom',
  
  // Setup Files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module Paths
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  
  // Test File Patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
  // Coverage Configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/not-found.tsx',
    '!src/app/**/error.tsx',
  ],
  
  // Coverage Thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Transform Ignore Patterns
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Module File Extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test Timeout
  testTimeout: 10000,
};

module.exports = createJestConfig(customJestConfig);

// ===============================
// jest.setup.js
// 🔧 Jest Setup Configuration

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock global objects für Tests
Object.assign(global, { TextDecoder, TextEncoder });

// Mock Next.js Router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Mock console für cleaner Test Output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

// ===============================
// src/utils/test-utils.tsx
// 🛠️ Test Utilities und Custom Render

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// ===============================
// MOCK DATA GENERATORS
// ===============================

export const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  confirmed: true,
  blocked: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockWord = {
  id: '1',
  text: 'Meditation',
  weight: 5,
  color: '#3B82F6',
  link: '',
  description: 'Achtsamkeitsmeditation',
};

export const mockWordCloud = {
  id: '1',
  title: 'Test Word Cloud',
  description: 'Eine Test Word Cloud',
  words: [mockWord],
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  hoverColor: '#3B82F6',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// ===============================
// CUSTOM RENDER FUNCTION
// ===============================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withErrorBoundary?: boolean;
  withQueryClient?: boolean;
}

const AllTheProviders = ({ 
  children, 
  withErrorBoundary = true,
  withQueryClient = true 
}: { 
  children: ReactNode;
  withErrorBoundary?: boolean;
  withQueryClient?: boolean;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  let wrappedChildren = children;

  if (withQueryClient) {
    wrappedChildren = (
      <QueryClientProvider client={queryClient}>
        {wrappedChildren}
      </QueryClientProvider>
    );
  }

  if (withErrorBoundary) {
    wrappedChildren = (
      <ErrorBoundary>
        {wrappedChildren}
      </ErrorBoundary>
    );
  }

  return <>{wrappedChildren}</>;
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { withErrorBoundary, withQueryClient, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders 
        withErrorBoundary={withErrorBoundary}
        withQueryClient={withQueryClient}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// ===============================
// API MOCKS
// ===============================

export const mockApiService = {
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(),
  getCurrentUser: jest.fn(),
  getAllWordClouds: jest.fn(),
  getWordCloud: jest.fn(),
  createWordCloud: jest.fn(),
  updateWordCloud: jest.fn(),
  deleteWordCloud: jest.fn(),
};

// Mock für API Service
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: mockApiService,
  ...mockApiService,
}));

// ===============================
// TEST HELPERS
// ===============================

/**
 * Wartet auf nächste Tick
 */
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock localStorage für Tests
 */
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => storage[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete storage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }),
  };
};

/**
 * Mock für fetch Requests
 */
export const mockFetch = (response: any, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 400,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
};

/**
 * Mock für API Error
 */
export const mockApiError = (message = 'API Error', status = 400) => {
  const error = new Error(message) as any;
  error.status = status;
  return error;
};

/**
 * Trigger Error in Component
 */
export const triggerError = (component: any, error: Error) => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  component.componentDidCatch(error, { componentStack: 'test stack' });
  errorSpy.mockRestore();
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// ===============================
// EXAMPLE TEST FILES
// ===============================

// src/services/__tests__/api.test.ts
/*
import apiService from '../api';
import { mockUser, mockWordCloud, mockApiError } from '@/utils/test-utils';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const credentials = { identifier: 'test@example.com', password: 'password' };
      const response = { jwt: 'token', user: mockUser };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await apiService.login(credentials);
      
      expect(result).toEqual(response);
      expect(localStorage.setItem).toHaveBeenCalledWith('strapiToken', 'token');
      expect(localStorage.setItem).toHaveBeenCalledWith('strapiUser', JSON.stringify(mockUser));
    });

    it('should handle login error', async () => {
      const credentials = { identifier: 'test@example.com', password: 'wrong' };
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(mockApiError('Invalid credentials', 401));

      await expect(apiService.login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should logout successfully', async () => {
      await apiService.logout();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('strapiToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('strapiUser');
    });

    it('should check authentication status', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('token');
      
      expect(apiService.isAuthenticated()).toBe(true);
      
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      
      expect(apiService.isAuthenticated()).toBe(false);
    });
  });

  describe('Word Clouds', () => {
    it('should fetch all word clouds', async () => {
      const response = { data: [mockWordCloud], meta: {} };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await apiService.getAllWordClouds();
      
      expect(result).toEqual([mockWordCloud]);
    });

    it('should create word cloud', async () => {
      const wordCloudData = { title: 'New Cloud', description: 'Test' };
      const response = { data: mockWordCloud };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await apiService.createWordCloud(wordCloudData);
      
      expect(result).toEqual(mockWordCloud);
    });

    it('should update word cloud', async () => {
      const updates = { title: 'Updated Title' };
      const response = { data: { ...mockWordCloud, ...updates } };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await apiService.updateWordCloud('1', updates);
      
      expect(result.title).toBe('Updated Title');
    });

    it('should delete word cloud', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await expect(apiService.deleteWordCloud('1')).resolves.not.toThrow();
    });
  });
});
*/

// src/hooks/__tests__/useAuth.test.ts
/*
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../index';
import { mockUser, mockApiService } from '@/utils/test-utils';

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no user', () => {
    mockApiService.isAuthenticated.mockReturnValue(false);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should restore user from localStorage on init', () => {
    mockApiService.isAuthenticated.mockReturnValue(true);
    mockApiService.getCurrentUser.mockReturnValue(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should login successfully', async () => {
    const credentials = { identifier: 'test@example.com', password: 'password' };
    const authResponse = { jwt: 'token', user: mockUser };
    
    mockApiService.login.mockResolvedValue(authResponse);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login(credentials);
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async () => {
    const credentials = { identifier: 'test@example.com', password: 'wrong' };
    const error = new Error('Invalid credentials');
    
    mockApiService.login.mockRejectedValue(error);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      try {
        await result.current.login(credentials);
      } catch (e) {
        // Expected to throw
      }
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should logout successfully', async () => {
    mockApiService.logout.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAuth());
    
    // Set initial user
    act(() => {
      result.current.user = mockUser;
    });
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.error = 'Some error';
    });
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });
});
*/

// src/components/__tests__/ErrorBoundary.test.tsx
/*
import React from 'react';
import { render, screen } from '@/utils/test-utils';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should render error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Etwas ist schiefgelaufen/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Erneut versuchen/ })).toBeInTheDocument();
  });

  it('should call onError when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object),
      expect.any(String)
    );
  });

  it('should render custom fallback', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should reset error state when retry is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Etwas ist schiefgelaufen/)).toBeInTheDocument();
    
    // Click retry button
    const retryButton = screen.getByRole('button', { name: /Erneut versuchen/ });
    retryButton.click();
    
    // Re-render with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
*/

// ===============================
// PACKAGE.JSON SCRIPTS
// ===============================

/*
// package.json scripts section:
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:update": "jest --updateSnapshot"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@types/jest": "^29.5.8"
  }
}
*/

// ===============================
// CONTINUOUS INTEGRATION
// ===============================

/*
// .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true

  e2e:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js 18.x
        uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
        env:
          NODE_ENV: test
      
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      
      - name: Run E2E tests
        run: npm run test:e2e
*/