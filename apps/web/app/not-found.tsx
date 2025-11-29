import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <title>404: Page Not Found | Apsara Digital</title>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {/* Status Code */}
            <h1 className="mb-4 text-6xl font-bold text-blue-600">
              404
            </h1>

            {/* Title */}
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Page Not Found
            </h2>

            {/* Description */}
            <p className="mb-8 leading-relaxed text-gray-600">
              Sorry, the page you are looking for could not be found.
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/"
                className="block w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Go Home
              </Link>
            </div>

            {/* Additional Help Text */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
