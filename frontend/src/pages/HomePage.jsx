import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API_URL = 'http://localhost:3001/api'

export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [popularDestinations, setPopularDestinations] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState('right')
  const [stats, setStats] = useState(null)
  const [faqItems, setFaqItems] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [regionalPackages, setRegionalPackages] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [destinationsRes, testimonialsRes, statsRes, faqRes, regionalRes] = await Promise.all([
          fetch(`${API_URL}/destinations/popular`),
          fetch(`${API_URL}/testimonials`),
          fetch(`${API_URL}/stats`),
          fetch(`${API_URL}/faq`),
          fetch(`${API_URL}/regional-packages`)
        ])

        const [destinations, testimonials, stats, faq, regional] = await Promise.all([
          destinationsRes.json(),
          testimonialsRes.json(),
          statsRes.json(),
          faqRes.json(),
          regionalRes.json()
        ])

        setPopularDestinations(destinations)
        setTestimonials(testimonials)
        setStats(stats)
        setFaqItems(faq.slice(0, 6))
        setRegionalPackages(regional.slice(0, 2))
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const res = await fetch(`${API_URL}/destinations/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSearchResults(data.slice(0, 5))
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handlePrevTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection('left')
    setTimeout(() => {
      setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)
      setIsAnimating(false)
    }, 300)
  }

  const handleNextTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection('right')
    setTimeout(() => {
      setCurrentTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length <= 3) return
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNextTestimonial()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length, isAnimating])

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterMessage('Please enter a valid email address')
      return
    }
    // Mock submission
    setNewsletterMessage('Thank you for subscribing!')
    setNewsletterEmail('')
    setTimeout(() => setNewsletterMessage(''), 5000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent via-accent to-primary-dark text-white py-20 lg:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large yellow circle behind text */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-tertiary rounded-full opacity-20"></div>
          {/* Dotted pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          ></div>
          {/* Floating shapes */}
          <div className="absolute top-20 right-20 w-16 h-16 border-4 border-secondary rounded-full hidden lg:block"></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-quaternary/30 rounded-lg rotate-12 hidden lg:block"></div>
          {/* Blob-masked hero decoration */}
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 hidden lg:block" style={{borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'}}></div>
          <div className="absolute top-10 left-1/3 w-48 h-48 bg-tertiary/15 hidden lg:block" style={{borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-6 animate-pop">
            Stay Connected <span className="text-tertiary">Anywhere</span>
          </h1>
          <p className="text-xl sm:text-2xl text-accent/90 mb-10 max-w-3xl mx-auto font-body">
            Affordable eSIM data plans for 190+ destinations. No physical SIM needed - just scan, connect, and go.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Where are you traveling to?"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="w-full px-6 py-4 pl-14 text-lg rounded-full text-foreground bg-input border-2 border-foreground shadow-hard focus:outline-none focus:border-accent focus:shadow-hard-accent transition-all duration-300"
              />
              <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-mutedForeground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-4 py-2 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring flex items-center gap-2"
              >
                <span>Search</span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-foreground shadow-hard-xl overflow-hidden z-50">
                {searchResults.map(dest => (
                  <Link
                    key={dest.id}
                    to={`/destinations/${dest.slug}`}
                    className="flex items-center px-6 py-3 hover:bg-muted text-foreground transition-colors duration-200"
                  >
                    <span className="text-2xl mr-3">{dest.flag_emoji}</span>
                    <span className="font-semibold">{dest.name}</span>
                    <span className="ml-auto text-accent font-bold">From ${dest.starting_price}</span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 items-center">
            <span className="text-white/80 font-semibold">Popular:</span>
            {popularDestinations.slice(0, 5).map(dest => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.slug}`}
                className="px-4 py-2 bg-white/20 hover:bg-tertiary hover:text-foreground border-2 border-white/40 hover:border-foreground rounded-full text-sm font-semibold transition-all duration-300 ease-bouncy"
              >
                {dest.flag_emoji} {dest.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-background py-12 border-y-2 border-border relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-10 w-24 h-24 bg-secondary/10 rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-tertiary/10 rounded-full translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="animate-pop" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-foreground shadow-hard">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-heading font-extrabold text-accent">{stats?.destinations || '190+'}</div>
              <div className="text-mutedForeground text-sm font-semibold">Destinations</div>
            </div>
            <div className="animate-pop" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-foreground shadow-hard">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-3xl font-heading font-extrabold text-secondary">{stats?.travelers || '2M+'}</div>
              <div className="text-mutedForeground text-sm font-semibold">Happy Travelers</div>
            </div>
            <div className="animate-pop" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-foreground shadow-hard">
                <svg className="w-8 h-8 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div className="text-3xl font-heading font-extrabold text-tertiary">{stats?.rating || '4.8'}/5</div>
              <div className="text-mutedForeground text-sm font-semibold">Star Rating</div>
            </div>
            <div className="animate-pop" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-foreground shadow-hard">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-3xl font-heading font-extrabold text-accent">{stats?.support || '24/7'}</div>
              <div className="text-mutedForeground text-sm font-semibold">Support</div>
            </div>
            <div className="col-span-2 md:col-span-1 animate-pop" style={{animationDelay: '0.5s'}}>
              <div className="w-16 h-16 bg-quaternary rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-foreground shadow-hard">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-3xl font-heading font-extrabold text-quaternary">{stats?.delivery || 'Instant'}</div>
              <div className="text-mutedForeground text-sm font-semibold">Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee - Trusted Network Partners */}
      <div className="bg-muted py-8 border-y-2 border-border overflow-hidden">
        <div className="relative">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}} />
          <div className="flex animate-marquee">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center space-x-12 px-6 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-accent border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-white font-heading font-bold text-sm">V</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">Vodafone</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-white font-heading font-bold text-sm">T</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">T-Mobile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-foreground font-heading font-bold text-sm">O</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">Orange</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-white font-heading font-bold text-sm">A</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">AT&T</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-accent border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-white font-heading font-bold text-sm">M</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">Movistar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-white font-heading font-bold text-sm">C</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">Claro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-foreground font-heading font-bold text-sm">3</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">Three</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center shadow-hard-sm">
                    <span className="text-white font-heading font-bold text-sm">E</span>
                  </div>
                  <span className="font-heading font-bold text-foreground whitespace-nowrap">EE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Squiggle Divider */}
      <div className="relative h-16 bg-background overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round"/>
          <path d="M0,50 Q150,70 300,50 T600,50 T900,50 T1200,50" fill="none" stroke="#F472B6" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>

      {/* How It Works */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Dot Grid Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #1E293B 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="animate-pop">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-center mb-4 text-foreground">How It Works</h2>
            <p className="text-mutedForeground text-center mb-12 max-w-2xl mx-auto font-medium">
              Get connected in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Dashed connecting lines (hidden on mobile) */}
            <svg className="absolute top-24 left-0 w-full h-8 hidden md:block" style={{zIndex: 0}}>
              <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="#F472B6" strokeWidth="3" strokeDasharray="8,8" />
              <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="#FBBF24" strokeWidth="3" strokeDasharray="8,8" />
            </svg>

            {/* Step 1 */}
            <div className="text-center relative z-10 animate-pop" style={{animationDelay: '0.1s'}}>
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-foreground shadow-hard hover:animate-wiggle">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="text-accent font-extrabold text-xs uppercase tracking-wider mb-2">STEP 1</div>
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground">Choose Your Destination</h3>
              <p className="text-mutedForeground">Search for your travel destination and browse our affordable data plans.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative z-10 animate-pop" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-foreground shadow-hard hover:animate-wiggle">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-secondary font-extrabold text-xs uppercase tracking-wider mb-2">STEP 2</div>
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground">Select a Data Package</h3>
              <p className="text-mutedForeground">Pick the perfect plan for your trip - from 1GB to unlimited data options.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative z-10 animate-pop" style={{animationDelay: '0.3s'}}>
              <div className="w-20 h-20 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-foreground shadow-hard hover:animate-wiggle">
                <svg className="w-10 h-10 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-tertiary font-extrabold text-xs uppercase tracking-wider mb-2">STEP 3</div>
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground">Scan QR & Connect</h3>
              <p className="text-mutedForeground">Receive your eSIM instantly via email. Scan the QR code and start browsing!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 animate-pop">
            <div>
              <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-foreground">Popular Destinations</h2>
              <p className="text-mutedForeground mt-2 font-medium">Most loved by our travelers</p>
            </div>
            <Link
              to="/destinations"
              className="hidden sm:inline-flex items-center text-accent hover:text-accent/80 font-bold transition-colors"
            >
              View All
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Skeleton loaders
              [...Array(8)].map((_, index) => (
                <div key={index} className="bg-card rounded-xl border-2 border-border shadow-hard-muted overflow-hidden animate-pulse">
                  <div className="h-32 bg-muted"></div>
                  <div className="p-4">
                    <div className="h-5 bg-muted rounded mb-2"></div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Actual destination cards - Sticker style
              popularDestinations.slice(0, 8).map((dest, idx) => {
                // Featured cards (every 3rd card) get pink shadow
                const isFeatured = idx % 3 === 0;
                return (
                <Link
                  key={dest.id}
                  to={`/destinations/${dest.slug}`}
                  className={`bg-card rounded-xl border-2 border-foreground ${isFeatured ? 'shadow-hard-secondary' : 'shadow-hard'} hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy overflow-hidden group`}
                >
                  <div className="h-32 bg-gradient-to-br from-accent to-secondary flex items-center justify-center relative">
                    <span className="text-6xl group-hover:animate-wiggle transition-transform">{dest.flag_emoji}</span>
                    {/* Floating icon badge */}
                    {idx % 3 === 0 && (
                      <div className="absolute -top-3 -right-3 w-12 h-12 bg-tertiary rounded-full border-2 border-foreground flex items-center justify-center shadow-hard">
                        <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-lg text-foreground">{dest.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-accent font-extrabold">From ${dest.starting_price}</span>
                      <div className="flex gap-1">
                        {[...Array(dest.coverage_quality || 5)].map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-quaternary rounded-sm"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })
            )}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/destinations"
              className="inline-flex items-center text-accent hover:text-accent/80 font-bold transition-colors"
            >
              View All Destinations
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
        {/* Floating shape decorations */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-tertiary/20 rounded-full hidden lg:block"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-secondary/20 rotate-45 hidden lg:block" style={{clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-4 border-accent/20 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-quaternary/20 rounded-lg rotate-12 hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="animate-pop">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-center mb-4 text-foreground">What Our Travelers Say</h2>
            <p className="text-mutedForeground text-center mb-12 max-w-2xl mx-auto font-medium">
              Join over 2 million happy travelers who stay connected with eSIM4Travel
            </p>
          </div>

          {testimonials.length > 0 && (
            <div className="relative max-w-4xl mx-auto overflow-hidden">
              {/* Testimonial Carousel with sliding animation */}
              <div
                className={`grid md:grid-cols-3 gap-8 mb-8 transition-all duration-300 ease-out ${
                  isAnimating
                    ? slideDirection === 'right'
                      ? 'opacity-0 translate-x-8'
                      : 'opacity-0 -translate-x-8'
                    : 'opacity-100 translate-x-0'
                }`}
              >
                {testimonials.slice(currentTestimonial, currentTestimonial + 3).concat(
                  testimonials.slice(0, Math.max(0, (currentTestimonial + 3) - testimonials.length))
                ).slice(0, 3).map((testimonial, index) => (
                  <div key={testimonial.id || index} className="bg-card rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none border-2 border-foreground shadow-hard-muted p-6 relative hover:scale-105 transition-all duration-300 ease-bouncy">
                    {/* Quotation mark decoration */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-secondary rounded-full border-2 border-foreground flex items-center justify-center shadow-hard">
                      <span className="text-2xl font-heading font-extrabold text-white">"</span>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-tertiary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-foreground mb-4 font-medium">"{testimonial.review_text}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-heading font-bold border-2 border-foreground">
                        {testimonial.customer_name?.[0] || 'A'}
                      </div>
                      <div className="ml-3">
                        <div className="font-heading font-bold text-foreground">{testimonial.customer_name}</div>
                        <div className="text-mutedForeground text-sm font-medium">{testimonial.country}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              {testimonials.length > 3 && (
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isAnimating) {
                          setIsAnimating(true)
                          setSlideDirection(idx > Math.floor(currentTestimonial / 3) ? 'right' : 'left')
                          setTimeout(() => {
                            setCurrentTestimonial(idx * 3)
                            setIsAnimating(false)
                          }, 300)
                        }
                      }}
                      className={`w-3 h-3 rounded-full border-2 border-foreground transition-all duration-300 ${
                        Math.floor(currentTestimonial / 3) === idx
                          ? 'bg-accent w-8'
                          : 'bg-muted hover:bg-secondary'
                      }`}
                      aria-label={`Go to testimonial group ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Carousel Navigation */}
              {testimonials.length > 3 && (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePrevTestimonial}
                    className="w-12 h-12 rounded-full bg-accent border-2 border-foreground text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm flex items-center justify-center shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Previous testimonial"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    className="w-12 h-12 rounded-full bg-accent border-2 border-foreground text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm flex items-center justify-center shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Next testimonial"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Squiggle Divider */}
      <div className="relative h-16 bg-background overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0,30 Q150,50 300,30 T600,30 T900,30 T1200,30" fill="none" stroke="#F472B6" strokeWidth="4" strokeLinecap="round"/>
          <path d="M0,55 Q150,35 300,55 T600,55 T900,55 T1200,55" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Regional Packages Highlight */}
      {regionalPackages.length > 0 && (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-teal-50 to-teal-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Travel Across Multiple Countries</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Get connected across entire regions with our multi-country eSIM packages
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {regionalPackages.map((pkg) => (
                <Link
                  key={pkg.id}
                  to={`/regional/${pkg.slug}`}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-teal-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-gray-600">{pkg.description}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                      Regional
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">Covers {pkg.countries_included?.length || 0} countries:</div>
                    <div className="flex flex-wrap gap-2">
                      {pkg.countries_included?.slice(0, 8).map((country, idx) => (
                        <span key={idx} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded">
                          {country}
                        </span>
                      ))}
                      {pkg.countries_included?.length > 8 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{pkg.countries_included.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-3xl font-bold text-teal-600">${pkg.price_usd}</div>
                      <div className="text-sm text-gray-500">{pkg.data_amount} • {pkg.validity_days} days</div>
                    </div>
                    <div className="text-teal-600 font-semibold flex items-center">
                      View Plans
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/regional"
                className="inline-flex items-center px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
              >
                View All Regional Packages
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Squiggle Divider */}
      <div className="relative h-16 bg-background overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0,25 Q150,55 300,25 T600,25 T900,25 T1200,25" fill="none" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/>
          <path d="M0,60 Q150,30 300,60 T600,60 T900,60 T1200,60" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pop">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-center mb-4 text-foreground">Frequently Asked Questions</h2>
            <p className="text-mutedForeground text-center mb-12 font-medium">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={faq.id || index} className="bg-card rounded-xl border-2 border-foreground shadow-hard overflow-hidden hover:shadow-hard-lg transition-all duration-300 ease-bouncy">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset transition-colors"
                >
                  <span className="font-heading font-bold text-foreground pr-4">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full ${openFaq === index ? 'bg-accent' : 'bg-secondary'} border-2 border-foreground flex items-center justify-center transition-all duration-300 ease-bouncy ${openFaq === index ? 'rotate-180' : ''}`}>
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-mutedForeground font-medium animate-pop">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/support"
              className="inline-flex items-center text-accent hover:text-accent/80 font-bold transition-colors"
            >
              View All FAQs
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-accent to-secondary rounded-2xl border-2 border-foreground shadow-hard-xl p-8 lg:p-12 text-center text-white relative overflow-hidden animate-pop">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-quaternary/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-2xl lg:text-3xl font-heading font-extrabold mb-3">Stay Updated with Travel Tips & Deals</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto font-medium">
                Subscribe to our newsletter for exclusive offers, destination guides, and travel connectivity tips.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-full text-foreground bg-input border-2 border-foreground shadow-hard focus:outline-none focus:border-tertiary focus:shadow-hard-tertiary transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-6 py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Subscribe
                  </button>
                </div>

                {newsletterMessage && (
                  <div className={`mt-4 text-sm font-bold ${newsletterMessage.includes('Thank') ? 'text-quaternary' : 'text-secondary'}`}>
                    {newsletterMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-accent via-accent to-primary-dark text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-20 h-20 border-4 border-tertiary rounded-full hidden lg:block"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-secondary/30 rounded-lg rotate-45 hidden lg:block"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 border-4 border-quaternary rounded-full hidden lg:block"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-pop">
          <h2 className="text-3xl lg:text-4xl font-heading font-extrabold mb-4">Ready to Stay Connected?</h2>
          <p className="text-xl text-white/90 mb-8 font-medium">
            Get your eSIM in minutes and enjoy seamless connectivity on your next trip.
          </p>
          <Link
            to="/destinations"
            className="inline-block bg-tertiary hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-hard-sm text-foreground border-2 border-foreground px-8 py-4 rounded-full text-lg font-bold shadow-hard transition-all duration-300 ease-bouncy"
          >
            Browse Destinations
          </Link>
        </div>
      </section>
    </div>
  )
}
