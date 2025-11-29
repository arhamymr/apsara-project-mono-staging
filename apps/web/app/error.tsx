'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  const getStatusColor = () => {
    return 'text-red-700';
  };

  return (
    <>
      <title>Error | Apsara Digital</title>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {/* Status Code */}
            <h1 className={`text-6xl font-bold ${getStatusColor()} mb-4`}>
              Error
            </h1>

            {/* Title */}
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Something went wrong
            </h2>

            {/* Description */}
            <p className="mb-8 leading-relaxed text-gray-600">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
              >
                ← Go Back
              </button>
            </div>

            {/* Additional Help Text */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact support.
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-gray-400">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
