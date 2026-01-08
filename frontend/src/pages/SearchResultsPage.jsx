import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const regions = [
    { id: 1, name: 'Europe', slug: 'europe' },
    { id: 2, name: 'Asia Pacific', slug: 'asia-pacific' },
    { id: 3, name: 'Americas', slug: 'americas' },
    { id: 4, name: 'Africa', slug: 'africa' },
    { id: 5, name: 'Oceania', slug: 'oceania' },
    { id: 6, name: 'Middle East', slug: 'middle-east' }
  ]

  useEffect(() => {
    if (query) {
      setLoading(true)
      fetch(`http://localhost:3001/api/destinations/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setDestinations(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Search error:', err)
          setLoading(false)
        })
    } else {
      setDestinations([])
      setLoading(false)
    }
  }, [query])

  // Filter destinations by selected region
  const filteredDestinations = selectedRegion
    ? destinations.filter(dest => dest.region_slug === selectedRegion)
    : destinations

  const handleRegionFilter = (regionSlug) => {
    setSelectedRegion(regionSlug)
  }

  const clearFilter = () => {
    setSelectedRegion(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-teal-600"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
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
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">Search Results</span>
        </nav>

        {/* Search Query Heading */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search results for "{query}"
          </h1>
          <p className="text-gray-600">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
            {selectedRegion ? ' (filtered)' : ' found'}
          </p>
        </div>

        {/* Region Filters */}
        {destinations.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Filter by region:</span>
              {regions.map(region => (
                <button
                  key={region.id}
                  onClick={() => handleRegionFilter(region.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRegion === region.slug
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region.name}
                </button>
              ))}
              {selectedRegion && (
                <button
                  onClick={clearFilter}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* No Results State */}
        {destinations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No destinations found</h3>
            <p className="mt-2 text-gray-600">
              We couldn't find any destinations matching "{query}".
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-600">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Link to="/destinations?region=europe" className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                  Europe
                </Link>
                <Link to="/destinations?region=asia-pacific" className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                  Asia Pacific
                </Link>
                <Link to="/destinations?region=americas" className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                  Americas
                </Link>
              </div>
            </div>
            <Link
              to="/destinations"
              className="mt-6 inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Browse All Destinations
            </Link>
          </div>
        )}

        {/* No Results After Filtering */}
        {destinations.length > 0 && filteredDestinations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No destinations in this region</h3>
            <p className="mt-2 text-gray-600">
              No destinations found in the selected region for your search.
            </p>
            <button
              onClick={clearFilter}
              className="mt-6 inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Search Results Grid */}
        {filteredDestinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map(destination => {
              // Popular destinations get pink hard shadow
              const isPopular = !!destination.is_popular;
              return (
              <Link
                key={destination.id}
                to={`/destinations/${destination.slug}`}
                className={`bg-card rounded-xl border-2 border-foreground ${isPopular ? 'shadow-hard-secondary' : 'shadow-hard'} hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy overflow-hidden group`}
              >
                {/* Flag */}
                <div className="bg-gradient-to-br from-accent to-secondary p-6 flex items-center justify-center relative">
                  <span className="text-6xl group-hover:animate-wiggle transition-transform">{destination.flag_emoji}</span>
                  {/* Popular star badge */}
                  {isPopular && (
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-tertiary rounded-full border-2 border-foreground flex items-center justify-center shadow-hard">
                      <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {destination.name}
                  </h3>

                  {/* Price */}
                  <p className="text-accent font-heading font-extrabold text-lg mb-2">
                    From ${destination.min_price ? destination.min_price.toFixed(2) : 'N/A'}
                  </p>

                  {/* Coverage Quality */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[...Array(destination.coverage_quality || 5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-quaternary rounded-sm"></div>
                      ))}
                    </div>
                    <span className="text-xs text-mutedForeground font-medium">Coverage</span>
                  </div>

                  {/* Package Count */}
                  <p className="text-sm text-mutedForeground font-medium">
                    {destination.package_count || 0} plans available
                  </p>
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
