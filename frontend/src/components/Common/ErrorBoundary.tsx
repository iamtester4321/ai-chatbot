import React, { Component, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center px-6">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 leading-relaxed">
                We encountered an unexpected error. Don't worry, this happens sometimes.
              </p>

              {/* Error Details (collapsible) */}
              {this.state.error?.message && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                    View error details
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <code className="text-xs text-red-600 break-all">
                      {this.state.error.message}
                    </code>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
                
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-500 pt-4">
                If this problem persists, please contact our support team.
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-purple-200 rounded-full opacity-40"></div>
            <div className="absolute bottom-32 left-16 w-3 h-3 bg-pink-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-20 right-10 w-1 h-1 bg-blue-300 rounded-full opacity-60"></div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;