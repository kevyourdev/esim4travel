import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function RegionalPackageDetailPage() {
  const { slug } = useParams()
  const [packageData, setPackageData] = useState(null)
  const [allPackages, setAllPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

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

        // Get the base region name from the slug (e.g., europe-39-3gb -> europe-39)
        const regionSlug = slug.split('-').slice(0, 2).join('-')

        // Get all packages for this region
        const regionPackages = parsedData.filter(pkg => pkg.slug.startsWith(regionSlug))

        if (regionPackages.length === 0) {
          throw new Error('Package not found')
        }

        setAllPackages(regionPackages)
        setPackageData(regionPackages[0]) // Use first package for base info
        setSelectedPackage(regionPackages.find(pkg => pkg.slug === slug) || regionPackages[0])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching package:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPackages()
  }, [slug])

  const handleAddToCart = () => {
    if (!selectedPackage) return

    addToCart(selectedPackage.id, 'regional')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-teal-600"></div>
            <p className="mt-4 text-gray-600">Loading package details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error: {error || 'Package not found'}</p>
            <Link to="/regional" className="mt-4 inline-block text-teal-600 hover:text-teal-700">
              ← Back to Regional eSIMs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const countries = packageData.countries_included || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/regional" className="hover:text-teal-600">Regional eSIMs</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">{packageData.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-12 text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{packageData.name}</h1>
          <p className="text-xl text-teal-100 mb-6">{packageData.description}</p>
          <div className="inline-block bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <span className="text-lg font-semibold">{countries.length} Countries Covered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Countries Covered */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Countries Covered</h2>
              <div className="flex flex-wrap gap-3">
                {countries.map((country, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">4G/5G Network Speeds</h3>
                    <p className="text-gray-600 text-sm">Enjoy fast mobile data across all covered countries</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Hotspot & Tethering</h3>
                    <p className="text-gray-600 text-sm">Share your connection with other devices</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Activation</h3>
                    <p className="text-gray-600 text-sm">Activate immediately upon arrival</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Keep Your Number</h3>
                    <p className="text-gray-600 text-sm">Your original number stays active for calls/SMS</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">No Voice/SMS</h3>
                    <p className="text-gray-600 text-sm">Data only service - use WhatsApp, Skype for calls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Data Plans */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Data Plan</h2>

              <div className="space-y-3 mb-6">
                {allPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPackage?.id === pkg.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900">{pkg.data_amount}</div>
                        <div className="text-sm text-gray-600">{pkg.validity_days} days</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">${pkg.price_usd.toFixed(2)}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedPackage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Total</div>
                  <div className="text-3xl font-bold text-gray-900">${selectedPackage.price_usd.toFixed(2)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedPackage.data_amount} • {selectedPackage.validity_days} days
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!selectedPackage}
                className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
