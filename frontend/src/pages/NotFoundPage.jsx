import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-teal-600 mb-4">404</div>
          <div className="text-6xl mb-4">🗺️</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-8 py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy inline-flex items-center focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Homepage
          </Link>
          <Link
            to="/destinations"
            className="bg-transparent hover:bg-tertiary text-foreground border-2 border-foreground px-8 py-3 rounded-full font-bold transition-all duration-300 ease-bouncy inline-flex items-center focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Browse Destinations
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/regional" className="text-teal-600 hover:text-teal-700 hover:underline">
              Regional eSIMs
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/support" className="text-teal-600 hover:text-teal-700 hover:underline">
              Help Center
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/my-orders" className="text-teal-600 hover:text-teal-700 hover:underline">
              My Orders
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/account" className="text-teal-600 hover:text-teal-700 hover:underline">
              Account Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
