// src/components/ErrorBoundary.tsx
// 🛡️ COMPREHENSIVE ERROR BOUNDARY SYSTEM

'use client';

import React, { Component, ErrorInfo, ReactNode, useState } from 'react';

// ===============================
// ERROR TYPES
// ===============================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  isolate?: boolean;
  showDetails?: boolean;
}

// ===============================
// MAIN ERROR BOUNDARY CLASS
// ===============================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || 'unknown';
    
    this.setState({
      errorInfo,
    });

    console.error('🚨 Error Boundary caught an error:', {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.state.errorInfo!, this.retry);
        }
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.retry}
          showDetails={this.props.showDetails ?? process.env.NODE_ENV === 'development'}
          isolate={this.props.isolate}
        />
      );
    }

    return this.props.children;
  }
}

// ===============================
// DEFAULT ERROR FALLBACK UI
// ===============================

interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  onRetry: () => void;
  showDetails: boolean;
  isolate?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  onRetry,
  showDetails,
  isolate,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyErrorDetails = async () => {
    const errorDetails = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  const containerClasses = isolate
    ? "border border-red-200 rounded-lg p-4 bg-red-50"
    : "min-h-screen flex items-center justify-center bg-gray-50";

  return (
    <div className={containerClasses}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          {isolate ? 'Komponente nicht verfügbar' : 'Etwas ist schiefgelaufen'}
        </h3>

        <p className="text-sm text-gray-600 text-center mb-4">
          {isolate 
            ? 'Dieser Bereich der Anwendung ist temporär nicht verfügbar.'
            : 'Die Anwendung ist auf einen unerwarteten Fehler gestoßen.'
          }
        </p>

        {errorId && (
          <div className="bg-gray-100 rounded p-2 mb-4">
            <p className="text-xs text-gray-500 text-center">
              Fehler-ID: <code className="font-mono">{errorId}</code>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            🔄 Erneut versuchen
          </button>

          {!isolate && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              🔃 Seite neu laden
            </button>
          )}

          {showDetails && (
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              🔍 {detailsOpen ? 'Details verbergen' : 'Details anzeigen'}
            </button>
          )}
        </div>

        {showDetails && detailsOpen && (
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-sm text-gray-700">Fehler-Details</h4>
              <button
                onClick={copyErrorDetails}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
              >
                {copied ? '✅ Kopiert' : '📋 Kopieren'}
              </button>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-600">Message:</p>
                <p className="text-xs text-gray-800 font-mono bg-gray-100 p-2 rounded">{error.message}</p>
              </div>
              
              {error.stack && (
                <div>
                  <p className="text-xs font-semibold text-gray-600">Stack Trace:</p>
                  <pre className="text-xs text-gray-800 font-mono bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===============================
// COMPONENT ERROR BOUNDARY
// ===============================

export const ComponentErrorBoundary: React.FC<{ 
  children: ReactNode;
  componentName?: string;
}> = ({ children, componentName }) => {
  const fallback = (error: Error, errorInfo: ErrorInfo, retry: () => void) => (
    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600">⚠️</span>
        <h4 className="font-semibold text-red-800">
          {componentName || 'Komponente'} nicht verfügbar
        </h4>
      </div>
      <p className="text-sm text-red-700 mb-3">
        Diese Komponente konnte nicht geladen werden.
      </p>
      <button
        onClick={retry}
        className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
      >
        🔄 Erneut laden
      </button>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      isolate={true}
      onError={(error, errorInfo, errorId) => {
        console.error(`Component Error in ${componentName}:`, { error, errorInfo, errorId });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// ===============================
// EXPORTS
// ===============================

export default ErrorBoundary;