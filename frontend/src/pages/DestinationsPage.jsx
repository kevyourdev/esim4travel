import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState([])
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all')
  const [sortBy, setSortBy] = useState('popular')
  const [displayCount, setDisplayCount] = useState(24)

  const regions = [
    { name: 'All Destinations', slug: 'all' },
    { name: 'Europe', slug: 'europe' },
    { name: 'Asia Pacific', slug: 'asia-pacific' },
    { name: 'Americas', slug: 'americas' },
    { name: 'Africa', slug: 'africa' },
    { name: 'Oceania', slug: 'oceania' },
    { name: 'Middle East', slug: 'middle-east' }
  ]

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3001/api/destinations')
        if (!response.ok) throw new Error('Failed to fetch destinations')
        const data = await response.json()
        setDestinations(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  // Update selected region from URL params
  useEffect(() => {
    const regionParam = searchParams.get('region')
    if (regionParam) {
      setSelectedRegion(regionParam)
    }
  }, [searchParams])

  // Filter and sort destinations
  const getFilteredDestinations = () => {
    let filtered = [...destinations]

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(dest => {
        const regionSlug = dest.region_slug || dest.region?.slug
        return regionSlug === selectedRegion
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(query)
      )
    }

    // Sort destinations
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => {
          if (a.is_popular && !b.is_popular) return -1
          if (!a.is_popular && b.is_popular) return 1
          return 0
        })
        break
      case 'a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price-low-high':
        filtered.sort((a, b) => (a.min_price || 0) - (b.min_price || 0))
        break
      default:
        break
    }

    return filtered.slice(0, displayCount)
  }

  const filteredDestinations = getFilteredDestinations()
  const hasMore = filteredDestinations.length === displayCount &&
                  destinations.length > displayCount

  const handleRegionChange = (regionSlug) => {
    setSelectedRegion(regionSlug)
    setDisplayCount(24) // Reset pagination
    if (regionSlug === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ region: regionSlug })
    }
  }

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 24)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setDisplayCount(24) // Reset pagination when searching
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destinations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Floating Confetti Decorations - hidden on mobile */}
      <div className="hidden lg:block absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full"></div>
      <div className="hidden lg:block absolute top-40 right-20 w-16 h-16 bg-tertiary/20 rotate-45" style={{clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}}></div>
      <div className="hidden lg:block absolute top-96 left-1/4 w-24 h-24 bg-quaternary/20 rounded-lg rotate-12"></div>
      <div className="hidden lg:block absolute bottom-40 right-1/3 w-28 h-28 bg-accent/20 rounded-full"></div>
      <div className="hidden lg:block absolute bottom-20 left-20 w-20 h-20 bg-secondary/20 rotate-45" style={{clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}}></div>
      <div className="hidden lg:block absolute top-1/2 right-10 w-16 h-16 bg-tertiary/20 rounded-lg -rotate-12"></div>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Destinations</h1>
          <p className="text-gray-600">Choose from over 190+ destinations worldwide</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="popular">Sort: Popular</option>
              <option value="a-z">Sort: A-Z</option>
              <option value="price-low-high">Sort: Price (Low-High)</option>
            </select>
          </div>
        </div>

        {/* Region Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {regions.map(region => (
              <button
                key={region.slug}
                onClick={() => handleRegionChange(region.slug)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedRegion === region.slug
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
        </div>

        {/* Destination Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedRegion('all')
                setSearchParams({})
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map(destination => {
                // Popular destinations get pink hard shadow
                const isPopular = !!destination.is_popular;
                const inWishlist = isInWishlist(destination.id);
                return (
                <div
                  key={destination.id}
                  className={`bg-card rounded-xl border-2 border-foreground ${isPopular ? 'shadow-hard-secondary' : 'shadow-hard'} hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy overflow-hidden group relative`}
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(destination);
                    }}
                    className={`absolute top-3 left-3 z-10 w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center shadow-hard-sm transition-all duration-300 hover:scale-110 ${
                      inWishlist
                        ? 'bg-secondary text-white'
                        : 'bg-white/90 text-secondary hover:bg-secondary hover:text-white'
                    }`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <Link to={`/destinations/${destination.slug}`}>
                    {/* Flag/Image Section */}
                    <div className="bg-gradient-to-br from-accent to-secondary h-40 flex items-center justify-center relative">
                      <span className="text-7xl group-hover:animate-wiggle transition-transform">{destination.flag_emoji}</span>
                      {/* Popular star badge */}
                      {isPopular && (
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-tertiary rounded-full border-2 border-foreground flex items-center justify-center shadow-hard">
                          <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">{destination.name}</h3>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm text-mutedForeground">From </span>
                          <span className="text-xl font-heading font-extrabold text-accent">
                            ${destination.min_price ? destination.min_price.toFixed(2) : '4.99'}
                          </span>
                        </div>

                        {/* Coverage Quality */}
                        <div className="flex gap-1">
                          {[...Array(destination.coverage_quality || 5)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-quaternary rounded-sm"></div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-mutedForeground font-medium">
                          {destination.package_count || '5'} plans available
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors"
                >
                  Load More Destinations
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
