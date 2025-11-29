import { Head } from '@inertiajs/react';

export default function ErrorPage({ status }) {
  const title = {
    503: '503: Service Unavailable',
    500: '500: Server Error',
    404: '404: Page Not Found',
    403: '403: Forbidden',
  }[status];

  const description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[status];

  const getStatusColor = () => {
    switch (status) {
      case 404:
        return 'text-blue-600';
      case 403:
        return 'text-red-600';
      case 500:
        return 'text-red-700';
      case 503:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <Head title={`${title} | Apsara Digital`} />
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {/* Status Code */}
            <h1 className={`text-6xl font-bold ${getStatusColor()} mb-4`}>
              {status}
            </h1>

            {/* Title */}
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              {title}
            </h2>

            {/* Description */}
            <p className="mb-8 leading-relaxed text-gray-600">{description}</p>

            {/* Action Buttons */}
            <div className="space-y-4">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
