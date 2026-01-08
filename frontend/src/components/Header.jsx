import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useWishlist } from '../context/WishlistContext'
import CartDrawer from './CartDrawer'
import LoginModal from './LoginModal'
import DeviceCompatibilityChecker from './DeviceCompatibilityChecker'

export default function Header() {
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isDeviceCheckerOpen, setIsDeviceCheckerOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { itemCount, setIsCartOpen } = useCart()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)

  const regions = [
    { name: 'Europe', slug: 'europe' },
    { name: 'Asia Pacific', slug: 'asia-pacific' },
    { name: 'Americas', slug: 'americas' },
    { name: 'Africa', slug: 'africa' },
    { name: 'Oceania', slug: 'oceania' },
    { name: 'Middle East', slug: 'middle-east' }
  ]

  // Search autocomplete functionality
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsSearching(true)
      fetch(`http://localhost:3001/api/destinations/search?q=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setSearchResults(data)
          setIsSearching(false)
        })
        .catch(err => {
          console.error('Search error:', err)
          setIsSearching(false)
        })
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleSearchClick = (destination) => {
    navigate(`/destinations/${destination.slug}`)
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b-2 border-foreground shadow-hard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-accent rounded-full border-2 border-foreground flex items-center justify-center shadow-hard-sm group-hover:animate-wiggle transition-all">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-xl font-heading font-extrabold text-accent">eSIM4Travel</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Destinations Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsDestinationsOpen(true)}
                onMouseLeave={() => setIsDestinationsOpen(false)}
              >
                <button className="text-foreground hover:text-accent font-semibold flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-ring rounded-full px-3 py-1 transition-all duration-300 ease-bouncy hover:scale-105">
                  <span>Destinations</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDestinationsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl border-2 border-foreground shadow-hard-lg py-2 animate-pop">
                    <Link
                      to="/destinations"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-tertiary hover:text-foreground font-bold transition-colors"
                    >
                      All Destinations
                    </Link>
                    <div className="border-t-2 border-border my-2"></div>
                    {regions.map(region => (
                      <Link
                        key={region.slug}
                        to={`/destinations?region=${region.slug}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted font-medium transition-colors"
                      >
                        {region.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/regional" className="text-foreground hover:text-accent font-semibold transition-all duration-300 ease-bouncy hover:scale-105">
                Regional eSIMs
              </Link>

              <Link to="/how-it-works" className="text-foreground hover:text-accent font-semibold transition-all duration-300 ease-bouncy hover:scale-105">
                How It Works
              </Link>

              <Link to="/support" className="text-foreground hover:text-accent font-semibold transition-all duration-300 ease-bouncy hover:scale-105">
                Support
              </Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Device Checker */}
              <button
                onClick={() => setIsDeviceCheckerOpen(true)}
                className="hidden md:flex w-10 h-10 rounded-full bg-accent/20 border-2 border-foreground items-center justify-center hover:animate-wiggle shadow-hard-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring"
                title="Check device compatibility"
              >
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex w-10 h-10 rounded-full bg-quaternary border-2 border-foreground items-center justify-center hover:animate-wiggle shadow-hard-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex w-10 h-10 rounded-full bg-secondary border-2 border-foreground items-center justify-center hover:animate-wiggle shadow-hard-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist Icon with Badge */}
              <Link
                to="/wishlist"
                className="relative hidden md:flex w-10 h-10 rounded-full bg-secondary/20 border-2 border-foreground items-center justify-center hover:animate-wiggle shadow-hard-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring"
                title="My Wishlist"
              >
                <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-heading font-extrabold rounded-full w-6 h-6 flex items-center justify-center border-2 border-foreground shadow-hard-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon with Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center hover:animate-wiggle shadow-hard-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-heading font-extrabold rounded-full w-6 h-6 flex items-center justify-center border-2 border-foreground shadow-hard-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Account/Login Button */}
              {user ? (
                <div
                  className="relative hidden md:block"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <button className="text-foreground hover:text-accent font-semibold flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-full px-3 py-1 transition-all duration-300 ease-bouncy hover:scale-105">
                    <div className="w-8 h-8 bg-accent rounded-full border-2 border-foreground flex items-center justify-center text-white font-heading font-extrabold shadow-hard-sm">
                      {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                    <span className="font-heading">{user.first_name || 'Account'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl border-2 border-foreground shadow-hard-lg py-2 animate-pop">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-foreground hover:bg-muted font-semibold transition-colors"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2 text-foreground hover:bg-muted font-semibold transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary hover:text-white font-semibold transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden md:block bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-4 py-2 rounded-full font-heading font-bold shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-teal-500 rounded p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/destinations"
                className="block text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Destinations
              </Link>
              {regions.map(region => (
                <Link
                  key={region.slug}
                  to={`/destinations?region=${region.slug}`}
                  className="block text-gray-600 hover:text-primary pl-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {region.name}
                </Link>
              ))}
              <Link
                to="/regional"
                className="block text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Regional eSIMs
              </Link>
              <Link
                to="/how-it-works"
                className="block text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/support"
                className="block text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                to="/wishlist"
                className="block text-gray-700 hover:text-primary font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <button
                onClick={() => {
                  setIsDeviceCheckerOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left text-gray-700 hover:text-primary font-medium py-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Check Device Compatibility
              </button>
              {user ? (
                <>
                  <Link
                    to="/my-orders"
                    className="block text-gray-700 hover:text-primary font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/account"
                    className="block text-gray-700 hover:text-primary font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-primary font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary font-medium py-2"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <DeviceCompatibilityChecker isOpen={isDeviceCheckerOpen} onClose={() => setIsDeviceCheckerOpen(false)} />

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchQuery('')
              setSearchResults([])
            }}
          ></div>

          {/* Modal Content */}
          <div className="flex min-h-screen items-start justify-center p-4 pt-20">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchEnter}
                    placeholder="Search destinations..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSearchResults([])
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className="mt-2 text-sm text-gray-500">Type at least 2 characters to search...</p>
                )}
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {isSearching && (
                  <div className="p-8 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-teal-600"></div>
                    <p className="mt-2">Searching...</p>
                  </div>
                )}

                {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 font-medium">No destinations found</p>
                    <p className="text-sm mt-1">Try searching for another destination</p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="py-2">
                    {searchResults.map(destination => (
                      <button
                        key={destination.id}
                        onClick={() => handleSearchClick(destination)}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-4 transition-colors"
                      >
                        <div className="text-3xl">{destination.flag_emoji}</div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{destination.name}</p>
                          <p className="text-sm text-gray-500">
                            From ${destination.min_price ? destination.min_price.toFixed(2) : 'N/A'}
                          </p>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}

                {!isSearching && searchQuery.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="mt-2">Search for destinations</p>
                    <p className="text-sm mt-1">Type a country name to get started</p>
                  </div>
                )}
              </div>

              {/* Hint */}
              {searchQuery.length >= 2 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                  Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Enter</kbd> to see all results
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
