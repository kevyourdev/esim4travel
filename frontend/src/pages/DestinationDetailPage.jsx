import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function DestinationDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [destination, setDestination] = useState(null)
  const [packages, setPackages] = useState([])
  const [relatedDestinations, setRelatedDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(null)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const [openCoverageIndex, setOpenCoverageIndex] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch destination details
        const destResponse = await fetch(`http://localhost:3001/api/destinations/${slug}`, {
          credentials: 'include'
        })
        if (!destResponse.ok) {
          throw new Error('Destination not found')
        }
        const destData = await destResponse.json()
        setDestination(destData)

        // Fetch packages for this destination
        const pkgsResponse = await fetch(`http://localhost:3001/api/destinations/${slug}/packages`, {
          credentials: 'include'
        })
        const pkgsData = await pkgsResponse.json()
        setPackages(pkgsData)

        // Fetch related destinations (same region)
        if (destData.region_slug) {
          const relatedResponse = await fetch(`http://localhost:3001/api/destinations?region=${destData.region_slug}`, {
            credentials: 'include'
          })
          const relatedData = await relatedResponse.json()
          // Filter out current destination and limit to 4
          const filtered = relatedData.filter(d => d.slug !== slug).slice(0, 4)
          setRelatedDestinations(filtered)
        }
      } catch (error) {
        console.error('Failed to fetch destination:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  const handleAddToCart = async (pkg) => {
    setAddingToCart(pkg.id)
    try {
      // addToCart function in CartContext handles opening the drawer
      await addToCart(pkg.id)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const toggleCoverage = (index) => {
    setOpenCoverageIndex(openCoverageIndex === index ? null : index)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destination...</p>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-8">The destination you're looking for doesn't exist.</p>
          <Link to="/destinations" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">
            Browse All Destinations
          </Link>
        </div>
      </div>
    )
  }

  const faqs = [
    {
      question: "What is an eSIM?",
      answer: "An eSIM (embedded SIM) is a digital SIM card that allows you to activate a cellular plan without using a physical SIM card. It's built into your device and can be programmed remotely."
    },
    {
      question: "How do I install the eSIM?",
      answer: "After purchase, you'll receive a QR code via email. Simply scan the QR code with your device's camera in Settings > Cellular > Add eSIM. Full installation instructions will be provided with your order."
    },
    {
      question: "Can I use my regular number alongside eSIM?",
      answer: "Yes! Most modern devices support dual SIM functionality, allowing you to keep your primary number active while using the eSIM for data."
    },
    {
      question: "What happens when I run out of data?",
      answer: "Once you've used your data allowance, the eSIM will stop working. You can purchase additional data packages or top-ups at any time."
    },
    {
      question: "Can I share my data (tethering)?",
      answer: "Yes, most of our eSIM plans support tethering/hotspot functionality. Check the specific package details for confirmation."
    },
    {
      question: "How fast is the connection?",
      answer: `Most packages support 4G/LTE speeds in ${destination.name}. 5G may be available in select areas where supported by local carriers.`
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-mutedForeground hover:text-accent transition font-medium">
              Home
            </Link>
            <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
            <Link to="/destinations" className="text-mutedForeground hover:text-accent transition font-medium">
              Destinations
            </Link>
            <svg className="w-4 h-4 text-tertiary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
            <span className="text-foreground font-bold">{destination.name}</span>
          </nav>
        </div>
      </div>

      {/* Country Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white py-16 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-tertiary/30 rounded-full"></div>
        <div className="absolute top-5 right-20 w-20 h-20 bg-secondary/30 rotate-45" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
        <div className="absolute bottom-5 left-1/4 w-16 h-16 bg-quaternary/30 rounded-lg rotate-12"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-accent/30 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="text-7xl mb-4">{destination.flag_emoji}</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{destination.name}</h1>
            <p className="text-xl text-teal-50 max-w-2xl mx-auto">
              {destination.description || `Stay connected in ${destination.name} with affordable eSIM data plans. Choose from multiple packages to fit your needs.`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Packages */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Data Package</h2>

            {packages.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">No packages available for this destination.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`bg-white border-2 border-foreground rounded-xl p-6 transition hover:rotate-[-1deg] hover:scale-105 relative ${
                      pkg.is_popular ? 'shadow-hard-tertiary' : 'shadow-hard-muted'
                    }`}
                  >
                    {!!pkg.is_popular && (
                      <div className="absolute -top-5 right-4 transform rotate-12">
                        <div className="relative">
                          <div className="w-20 h-20 bg-tertiary rounded-full border-2 border-foreground shadow-hard flex items-center justify-center">
                            <svg className="w-10 h-10 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <span className="text-[10px] font-heading font-extrabold text-foreground tracking-wide">
                              POPULAR
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {pkg.data_amount}
                        <span className="text-2xl font-normal text-gray-600">{pkg.data_unit}</span>
                      </div>
                      <div className="text-gray-600">{pkg.validity_days} days validity</div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-teal-600">
                        ${pkg.price_usd.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">One-time payment</div>
                    </div>

                    <div className="space-y-2 mb-6 text-sm text-foreground">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mr-2 flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={3}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium">{pkg.network_type || '4G/LTE'} Network</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mr-2 flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={3}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium">{pkg.tethering_allowed ? 'Hotspot supported' : 'Data only'}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mr-2 flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={3}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium">Instant delivery</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(pkg)}
                      disabled={addingToCart === pkg.id}
                      className="w-full bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground py-3 px-6 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy disabled:bg-mutedForeground disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-hard focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {addingToCart === pkg.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Package Comparison Table */}
            {packages.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-heading font-extrabold text-foreground mb-6">Compare All Packages</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-card rounded-xl overflow-hidden border-2 border-foreground shadow-hard">
                    <thead>
                      <tr className="bg-accent">
                        <th className="px-4 py-4 text-left font-heading font-extrabold text-white border-b-2 border-foreground">
                          Feature
                        </th>
                        {packages.map((pkg, idx) => (
                          <th
                            key={pkg.id}
                            className={`px-4 py-4 text-center font-heading font-extrabold border-b-2 border-foreground ${
                              pkg.is_popular ? 'bg-tertiary text-foreground' : 'text-white'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              {!!pkg.is_popular && (
                                <span className="bg-foreground text-white px-3 py-1 rounded-full text-xs font-bold mb-2 border-2 border-white">
                                  POPULAR
                                </span>
                              )}
                              <span className="text-lg">
                                {pkg.data_amount}{pkg.data_unit}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b-2 border-foreground bg-muted hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-4 font-heading font-bold text-foreground">Data Amount</td>
                        {packages.map((pkg) => (
                          <td
                            key={pkg.id}
                            className={`px-4 py-4 text-center ${
                              pkg.is_popular ? 'bg-tertiary/20' : ''
                            }`}
                          >
                            <span className="font-heading font-extrabold text-foreground">
                              {pkg.data_amount}{pkg.data_unit}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-foreground hover:bg-accent/10 transition-colors">
                        <td className="px-4 py-4 font-heading font-bold text-foreground">Validity Period</td>
                        {packages.map((pkg) => (
                          <td
                            key={pkg.id}
                            className={`px-4 py-4 text-center ${
                              pkg.is_popular ? 'bg-tertiary/20' : ''
                            }`}
                          >
                            <span className="text-mutedForeground font-medium">{pkg.validity_days} days</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-foreground bg-muted hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-4 font-heading font-bold text-foreground">Price</td>
                        {packages.map((pkg) => (
                          <td
                            key={pkg.id}
                            className={`px-4 py-4 text-center ${
                              pkg.is_popular ? 'bg-tertiary/20' : ''
                            }`}
                          >
                            <span className="text-xl font-heading font-extrabold text-accent">
                              ${pkg.price_usd.toFixed(2)}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-foreground hover:bg-accent/10 transition-colors">
                        <td className="px-4 py-4 font-heading font-bold text-foreground">Network Type</td>
                        {packages.map((pkg) => (
                          <td
                            key={pkg.id}
                            className={`px-4 py-4 text-center ${
                              pkg.is_popular ? 'bg-tertiary/20' : ''
                            }`}
                          >
                            <span className="inline-block bg-quaternary text-white px-3 py-1 rounded-full text-sm font-heading font-bold border-2 border-foreground">
                              {pkg.network_type || '4G LTE'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-foreground bg-muted hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-4 font-heading font-bold text-foreground">Hotspot/Tethering</td>
                        {packages.map((pkg) => (
                          <td
                            key={pkg.id}
                            className={`px-4 py-4 text-center ${
                              pkg.is_popular ? 'bg-tertiary/20' : ''
                            }`}
                          >
                            {pkg.tethering_allowed ? (
                              <div className="w-8 h-8 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mx-auto">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={3}>
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center mx-auto">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={3}>
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b-2 border-foreground hover:bg-accent/10 transition-colors">
                        <td className="px-4 py-4 font-heading font-bold text-foreground">Instant Activation</td>
                        {packages.map((pkg) => (
                          <td
                            key={pkg.id}
                            className={`px-4 py-4 text-center ${
                              pkg.is_popular ? 'bg-tertiary/20' : ''
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mx-auto">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={3}>
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-muted">
                        <td className="px-4 py-4 font-heading font-bold text-foreground">Action</td>
                        {packages.map((pkg) => (
                          <td
                            key={pkg.id}
                            className={`px-4 py-4 text-center ${
                              pkg.is_popular ? 'bg-tertiary/20' : ''
                            }`}
                          >
                            <button
                              onClick={() => handleAddToCart(pkg)}
                              disabled={addingToCart === pkg.id}
                              className="bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground py-2 px-4 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy disabled:bg-mutedForeground disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-hard text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              {addingToCart === pkg.id ? 'Adding...' : 'Add to Cart'}
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          openFaqIndex === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Coverage Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Coverage Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Coverage Information</h3>

                <div className="space-y-4">
                  {/* Coverage Map Placeholder */}
                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Coverage Map</div>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{aspectRatio: '4/3'}}>
                      {/* Map placeholder with country outline */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-2">{destination.flag_emoji}</div>
                          <div className="text-2xl font-bold text-teal-600 mb-1">{destination.name}</div>
                          <div className="text-sm text-gray-600">Coverage Map</div>
                        </div>
                      </div>
                      {/* Coverage overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-teal-400/5 to-transparent"></div>
                      {/* Coverage indicators */}
                      <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1 text-xs font-medium">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-gray-700">Excellent Coverage</span>
                      </div>
                    </div>
                  </div>

                  {/* Network Partner Logos */}
                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Network Partners</div>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Partner 1 */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 mx-auto border border-gray-200">
                            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                          </div>
                          <div className="text-xs font-medium text-gray-700">Carrier A</div>
                        </div>
                      </div>
                      {/* Partner 2 */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 mx-auto border border-gray-200">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                          </div>
                          <div className="text-xs font-medium text-gray-700">Carrier B</div>
                        </div>
                      </div>
                      {/* Partner 3 */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 mx-auto border border-gray-200">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                          </div>
                          <div className="text-xs font-medium text-gray-700">Carrier C</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Connected to major carriers in {destination.name}</p>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Network Quality</div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded ${
                            i < (destination.coverage_quality || 4)
                              ? 'bg-teal-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {destination.coverage_quality || 4}/5 bars
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Network Type</div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                        4G LTE
                      </span>
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                        5G
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Features</div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Data only (No voice/SMS)
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Hotspot/Tethering supported
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Instant activation
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        No registration required
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Installation</div>
                    <p className="text-sm text-gray-700">
                      Simply scan the QR code we send you via email. Installation takes less than 5 minutes.
                    </p>
                  </div>

                  {/* Coverage Details Accordion */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Coverage Details</h4>
                    <div className="space-y-2">
                      {/* Supported Networks */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCoverage(0)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-900 text-sm">Supported Networks</span>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              openCoverageIndex === 0 ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openCoverageIndex === 0 && (
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-gray-700 mb-2">
                              Our eSIM works with major carriers in {destination.name}:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Primary: National carrier networks</li>
                              <li>• Backup: Alternative network providers</li>
                              <li>• Auto-switching for best coverage</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Speed (4G/5G) */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCoverage(1)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-900 text-sm">Speed (4G/5G)</span>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              openCoverageIndex === 1 ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openCoverageIndex === 1 && (
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-gray-700 mb-2">
                              Network speeds in {destination.name}:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• 4G LTE: Up to 100 Mbps download</li>
                              <li>• 5G: Up to 1 Gbps where available</li>
                              <li>• Consistent speeds in major cities</li>
                              <li>• Rural areas may experience reduced speeds</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Coverage Map */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCoverage(2)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-900 text-sm">Coverage Map</span>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              openCoverageIndex === 2 ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openCoverageIndex === 2 && (
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-gray-700 mb-2">
                              Coverage across {destination.name}:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Urban areas: 99% coverage</li>
                              <li>• Highways: 95% coverage</li>
                              <li>• Remote areas: Variable coverage</li>
                              <li>• Tourist destinations: Full coverage</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Data Usage Policy */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCoverage(3)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-900 text-sm">Data Usage Policy</span>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              openCoverageIndex === 3 ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openCoverageIndex === 3 && (
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-gray-700 mb-2">
                              Fair usage policy:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• No speed throttling</li>
                              <li>• Full data package available</li>
                              <li>• Tethering allowed on most plans</li>
                              <li>• Data valid for package duration</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Our support team is available 24/7 to assist you with any questions.
                </p>
                <Link
                  to="/support"
                  className="block w-full text-center bg-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Destinations */}
        {relatedDestinations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Other {destination.region_name} Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedDestinations.map((related) => (
                <Link
                  key={related.id}
                  to={`/destinations/${related.slug}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="bg-gradient-to-br from-teal-400 to-teal-500 p-12 flex items-center justify-center">
                    <div className="text-6xl">{related.flag_emoji}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition">
                      {related.name}
                    </h3>
                    <div className="text-teal-600 font-semibold">
                      From ${related.min_price?.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {related.package_count} plans available
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
