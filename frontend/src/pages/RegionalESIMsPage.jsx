import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function RegionalESIMsPage() {
  const [regionalPackages, setRegionalPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/regional-packages', {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to fetch packages')
        }

        const data = await response.json()
        // Parse countries_included if it's a string
        const parsedData = data.map(pkg => ({
          ...pkg,
          countries_included: typeof pkg.countries_included === 'string'
            ? JSON.parse(pkg.countries_included)
            : pkg.countries_included
        }))
        console.log('Regional packages:', parsedData)
        setRegionalPackages(parsedData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching regional packages:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-teal-600"></div>
            <p className="mt-4 text-gray-600">Loading regional packages...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">Regional eSIMs</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Regional eSIM Packages
          </h1>
          <p className="text-xl text-gray-600">
            Travel across multiple countries with a single eSIM. Perfect for multi-destination trips.
          </p>
        </div>

        {/* Regional Packages Grid */}
        {regionalPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regionalPackages.map(pkg => {
              const countries = Array.isArray(pkg.countries_included) ? pkg.countries_included : []

              return (
                <Link
                  key={pkg.id}
                  to={`/regional/${pkg.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  {/* Package Header */}
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">{pkg.name}</h2>
                    <p className="text-teal-100">{pkg.description}</p>
                  </div>

                  {/* Package Details */}
                  <div className="p-6">
                    {/* Countries Covered */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Countries Covered ({countries.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {countries.slice(0, 10).map((country, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {country}
                          </span>
                        ))}
                        {countries.length > 10 && (
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                            +{countries.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Data Options */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Data Option
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <div>
                            <span className="font-semibold text-gray-900">{pkg.data_amount}</span>
                            <span className="text-gray-600 text-sm ml-2">• {pkg.validity_days} days</span>
                          </div>
                          <div className="text-teal-600 font-bold text-lg">
                            ${pkg.price_usd.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Features
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-700">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          4G/5G Network
                        </li>
                        <li className="flex items-center text-sm text-gray-700">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Hotspot/Tethering supported
                        </li>
                        <li className="flex items-center text-sm text-gray-700">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Instant activation
                        </li>
                        <li className="flex items-center text-sm text-gray-700">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Data only (No voice/SMS)
                        </li>
                      </ul>
                    </div>

                    {/* View Details Button */}
                    <div className="pt-4">
                      <div className="w-full py-3 text-center bg-teal-600 text-white rounded-lg font-semibold group-hover:bg-teal-700 transition-colors">
                        View All Plans & Details
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">No regional packages available at this time.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Regional eSIMs?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cost Effective</h3>
              <p className="text-gray-600 text-sm">
                Save money compared to buying individual country eSIMs for multi-country trips.
              </p>
            </div>
            <div>
              <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seamless Roaming</h3>
              <p className="text-gray-600 text-sm">
                Automatically connect as you cross borders. No need to switch eSIMs.
              </p>
            </div>
            <div>
              <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Simple Setup</h3>
              <p className="text-gray-600 text-sm">
                Install once, use everywhere. Perfect for European tours or Asian adventures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
