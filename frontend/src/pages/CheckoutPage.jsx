import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function CheckoutPage() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: Payment, 3: Review, 4: Confirmation
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [errors, setErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVV, setCardCVV] = useState('')
  const [qrCodes, setQrCodes] = useState([])
  const [loadingQr, setLoadingQr] = useState(false)

  // Fetch QR codes when order is confirmed
  useEffect(() => {
    if (step === 4 && orderNumber) {
      setLoadingQr(true)
      fetch(`http://localhost:3001/api/orders/${orderNumber}/qr-code`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (data.qrCodes) {
            setQrCodes(data.qrCodes)
          }
        })
        .catch(err => console.error('Failed to fetch QR codes:', err))
        .finally(() => setLoadingQr(false))
    }
  }, [step, orderNumber])

  // Redirect if cart is empty
  if (cart.items.length === 0 && step < 4) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
        <button
          onClick={() => navigate('/destinations')}
          className="bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-6 py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Browse Destinations
        </button>
      </div>
    )
  }

  const validateEmail = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!emailConfirm) {
      newErrors.emailConfirm = 'Please confirm your email'
    } else if (email !== emailConfirm) {
      newErrors.emailConfirm = 'Emails do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (validateEmail()) {
      setStep(2)
    }
  }

  const validatePayment = () => {
    const newErrors = {}

    if (paymentMethod === 'credit-card') {
      // Validate card number (16 digits, spaces allowed)
      const cardDigits = cardNumber.replace(/\s/g, '')
      if (!cardDigits) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!/^\d{16}$/.test(cardDigits)) {
        newErrors.cardNumber = 'Card number must be 16 digits'
      }

      // Validate expiry (MM/YY format)
      if (!cardExpiry) {
        newErrors.cardExpiry = 'Expiry date is required'
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Invalid format (use MM/YY)'
      }

      // Validate CVV (3-4 digits)
      if (!cardCVV) {
        newErrors.cardCVV = 'CVV is required'
      } else if (!/^\d{3,4}$/.test(cardCVV)) {
        newErrors.cardCVV = 'CVV must be 3-4 digits'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (validatePayment()) {
      setStep(3)
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (!termsAccepted) {
      setErrors({ terms: 'Please accept the terms and conditions' })
      return
    }

    try {
      // Create order via API
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          paymentMethod: paymentMethod === 'credit-card' ? `Credit Card ending in ${cardNumber.slice(-4)}` : paymentMethod
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()
      setOrderNumber(data.order.id)
      setStep(4)
    } catch (error) {
      console.error('Order creation failed:', error)
      setErrors({ submit: 'Failed to create order. Please try again.' })
    }
  }

  const handleDownloadReceipt = () => {
    // Generate mock receipt as text
    const receiptText = `
eSIM4Travel - Order Receipt
=================================

Order Number: ${orderNumber}
Date: ${new Date().toLocaleDateString()}

Customer Information:
Email: ${email}

Items:
${cart.items.map(item => `
  ${item.destination_flag} ${item.destination_name}
  ${item.package_data_amount} ${item.package_data_unit} · ${item.package_validity_days} days
  Quantity: ${item.quantity}
  Price: $${item.total_price.toFixed(2)}
`).join('')}

Order Summary:
Subtotal: $${cart.subtotal.toFixed(2)}
${cart.discount > 0 ? `Discount: -$${cart.discount.toFixed(2)}\n` : ''}Total: $${cart.total.toFixed(2)}

Payment Method: ${paymentMethod === 'credit-card' ? `Credit Card ending in ${cardNumber.slice(-4)}` : paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}

Thank you for your purchase!
Visit support.esim4travel.com for installation help.
    `.trim()

    // Create blob and download
    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${orderNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Progress indicator
  const ProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div className="flex-1 text-center">
          <div className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-foreground font-heading font-extrabold text-lg transition-all duration-300 ease-bouncy ${step >= 1 ? 'bg-accent text-white shadow-hard scale-110' : 'bg-muted text-mutedForeground'}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <p className={`text-sm font-heading font-bold ${step >= 1 ? 'text-accent' : 'text-mutedForeground'}`}>Email</p>
        </div>
        <div className={`flex-1 h-2 border-2 border-foreground mx-2 ${step >= 2 ? 'bg-accent' : 'bg-muted'} transition-all duration-300`} style={{borderStyle: 'dashed'}}></div>
        <div className="flex-1 text-center">
          <div className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-foreground font-heading font-extrabold text-lg transition-all duration-300 ease-bouncy ${step >= 2 ? 'bg-secondary text-white shadow-hard scale-110' : 'bg-muted text-mutedForeground'}`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <p className={`text-sm font-heading font-bold ${step >= 2 ? 'text-secondary' : 'text-mutedForeground'}`}>Payment</p>
        </div>
        <div className={`flex-1 h-2 border-2 border-foreground mx-2 ${step >= 3 ? 'bg-secondary' : 'bg-muted'} transition-all duration-300`} style={{borderStyle: 'dashed'}}></div>
        <div className="flex-1 text-center">
          <div className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-foreground font-heading font-extrabold text-lg transition-all duration-300 ease-bouncy ${step >= 3 ? 'bg-tertiary text-foreground shadow-hard scale-110' : 'bg-muted text-mutedForeground'}`}>
            {step > 3 ? '✓' : '3'}
          </div>
          <p className={`text-sm font-heading font-bold ${step >= 3 ? 'text-tertiary' : 'text-mutedForeground'}`}>Confirm</p>
        </div>
      </div>
    </div>
  )

  // Order Summary Sidebar
  const OrderSummary = () => (
    <div className="bg-card border-2 border-foreground p-6 rounded-xl shadow-hard">
      <h3 className="text-xl font-heading font-extrabold text-foreground mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {cart.items.map(item => (
          <div key={item.id} className="flex justify-between text-sm border-b-2 border-muted pb-3">
            <div>
              <p className="font-heading font-bold text-foreground">
                {item.destination_flag} {item.destination_name}
              </p>
              <p className="text-mutedForeground font-medium">
                {item.package_data_amount} {item.package_data_unit} · {item.package_validity_days} days × {item.quantity}
              </p>
            </div>
            <p className="font-heading font-extrabold text-accent">${item.total_price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-foreground pt-4 space-y-2">
        <div className="flex justify-between text-mutedForeground font-medium">
          <span>Subtotal</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>
        {cart.discount > 0 && (
          <div className="flex justify-between text-quaternary font-bold">
            <span>Discount</span>
            <span>-${cart.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-2xl font-heading font-extrabold text-foreground pt-2 border-t-2 border-foreground">
          <span>Total</span>
          <span className="text-accent">${cart.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-heading font-extrabold text-foreground mb-8 text-center">Checkout</h1>

        {step < 4 && <ProgressIndicator />}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="bg-card border-2 border-foreground rounded-xl p-8 shadow-hard">
                <h2 className="text-2xl font-heading font-extrabold text-foreground mb-6">Customer Information</h2>
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="email-input"
                      className={`w-full px-4 py-3 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                        errors.email
                          ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                          : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">Confirm Email</label>
                    <input
                      type="email"
                      value={emailConfirm}
                      onChange={(e) => setEmailConfirm(e.target.value)}
                      data-testid="email-confirm-input"
                      className={`w-full px-4 py-3 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                        errors.emailConfirm
                          ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                          : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.emailConfirm && <p className="text-sm text-red-500 mt-1">{errors.emailConfirm}</p>}
                  </div>

                  <div className="mb-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={marketingOptIn}
                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                        className="mt-1 mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        I want to receive promotional emails and special offers
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-card border-2 border-foreground rounded-xl p-8 shadow-hard">
                <button
                  onClick={() => setStep(1)}
                  className="text-primary hover:text-primary-dark mb-4 flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Email
                </button>

                <h2 className="text-2xl font-heading font-extrabold text-foreground mb-6">Payment Method</h2>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4 mb-6">
                    {/* Credit Card Option */}
                    <div className={`border-2 rounded-lg p-4 ${paymentMethod === 'credit-card' ? 'border-primary' : 'border-gray-300'}`}>
                      <div className="flex items-center mb-4">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'credit-card'}
                          onChange={() => setPaymentMethod('credit-card')}
                          className="mr-2"
                        />
                        <span className="font-semibold">Credit Card</span>
                      </div>
                      {paymentMethod === 'credit-card' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">Card Number</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                                errors.cardNumber
                                  ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                                  : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                              }`}
                            />
                            {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">Expiry</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                                  errors.cardExpiry
                                    ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                                    : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                                }`}
                              />
                              {errors.cardExpiry && <p className="text-sm text-red-500 mt-1">{errors.cardExpiry}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={cardCVV}
                                onChange={(e) => setCardCVV(e.target.value)}
                                className={`w-full px-4 py-2 bg-input border-2 rounded-lg text-foreground focus:outline-none transition-all duration-300 ${
                                  errors.cardCVV
                                    ? 'border-red-500 shadow-[4px_4px_0px_0px_rgb(239,68,68)]'
                                    : 'border-slate-300 shadow-[4px_4px_0px_0px_transparent] focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]'
                                }`}
                              />
                              {errors.cardCVV && <p className="text-sm text-red-500 mt-1">{errors.cardCVV}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PayPal Option */}
                    <div className={`border-2 rounded-lg p-4 cursor-pointer hover:border-primary ${paymentMethod === 'paypal' ? 'border-primary' : 'border-gray-300'}`} onClick={() => setPaymentMethod('paypal')}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="mr-2"
                        />
                        <span className="font-semibold">PayPal</span>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Mock</span>
                      </div>
                    </div>

                    {/* Apple Pay Option */}
                    <div className={`border-2 rounded-lg p-4 cursor-pointer hover:border-primary ${paymentMethod === 'apple-pay' ? 'border-primary' : 'border-gray-300'}`} onClick={() => setPaymentMethod('apple-pay')}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'apple-pay'}
                          onChange={() => setPaymentMethod('apple-pay')}
                          className="mr-2"
                        />
                        <span className="font-semibold">Apple Pay</span>
                        <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Mock</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-3 mb-6 text-sm text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure payment powered by mock processing</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Continue to Review
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div className="bg-card border-2 border-foreground rounded-xl p-8 shadow-hard">
                <button
                  onClick={() => setStep(2)}
                  className="text-accent hover:text-secondary mb-4 flex items-center font-heading font-bold transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Payment
                </button>

                <h2 className="text-2xl font-heading font-extrabold text-foreground mb-6">Review Order</h2>

                <div className="mb-6 border-2 border-foreground rounded-lg p-4 bg-muted">
                  <h3 className="font-heading font-bold text-foreground mb-2">Delivery Email</h3>
                  <p className="text-mutedForeground font-medium">{email}</p>
                </div>

                <div className="mb-6 border-2 border-foreground rounded-lg p-4 bg-muted">
                  <h3 className="font-heading font-bold text-foreground mb-2">Payment Method</h3>
                  <p className="text-mutedForeground font-medium">
                    {paymentMethod === 'credit-card' && `Credit Card ending in ${cardNumber.slice(-4) || '****'}`}
                    {paymentMethod === 'paypal' && 'PayPal (Mock)'}
                    {paymentMethod === 'apple-pay' && 'Apple Pay (Mock)'}
                  </p>
                </div>

                <form onSubmit={handlePlaceOrder}>
                  <div className="mb-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-primary hover:underline">Terms and Conditions</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                    {errors.terms && <p className="text-sm text-red-500 mt-1">{errors.terms}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Place Order
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="bg-card border-2 border-foreground rounded-xl p-8 text-center shadow-hard relative overflow-hidden">
                {/* Confetti decorations */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-tertiary/30 rounded-full"></div>
                <div className="absolute top-8 right-8 w-8 h-8 bg-secondary/30 rotate-45" style={{clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}}></div>
                <div className="absolute bottom-12 left-8 w-10 h-10 bg-accent/30 rounded-lg rotate-12"></div>
                <div className="absolute bottom-4 right-12 w-12 h-12 bg-quaternary/30 rounded-full"></div>

                <div className="w-24 h-24 bg-quaternary rounded-full border-2 border-foreground flex items-center justify-center mx-auto mb-6 shadow-hard animate-bounce">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" strokeWidth={3}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>

                <h2 className="text-4xl font-heading font-extrabold text-foreground mb-4">Order Confirmed!</h2>
                <p className="text-lg text-mutedForeground font-medium mb-2">Thank you for your purchase</p>
                <p className="text-sm font-heading font-bold text-accent mb-6">Order #{orderNumber}</p>

                {/* Email Confirmation Notice */}
                <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 mb-8 flex items-start">
                  <div className="w-8 h-8 rounded-full bg-accent border-2 border-foreground flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-heading font-bold text-foreground text-sm">Confirmation Email Sent</p>
                    <p className="text-sm text-mutedForeground font-medium mt-1">
                      We've sent your eSIM details and activation instructions to <span className="font-heading font-bold text-accent">{email}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-muted border-2 border-foreground p-8 rounded-xl mb-8">
                  <p className="text-sm font-heading font-bold text-foreground mb-4">
                    {qrCodes.length > 1 ? 'Your eSIM QR Codes' : 'Your eSIM QR Code'}
                  </p>
                  {loadingQr ? (
                    <div className="w-48 h-48 bg-white border-2 border-foreground mx-auto flex items-center justify-center shadow-hard">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
                    </div>
                  ) : qrCodes.length > 0 ? (
                    <div className={`flex flex-wrap justify-center gap-6 ${qrCodes.length > 1 ? 'flex-wrap' : ''}`}>
                      {qrCodes.map((qr, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="w-48 h-48 bg-white border-2 border-foreground flex items-center justify-center shadow-hard p-2">
                            <img
                              src={qr.qrCodeImage}
                              alt={`eSIM QR Code for ${qr.destination}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs text-mutedForeground mt-2 font-medium">{qr.destination} - {qr.package}</p>
                          <p className="text-xs text-accent font-mono mt-1">{qr.activationCode}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-white border-2 border-foreground mx-auto flex items-center justify-center shadow-hard">
                      <svg className="w-32 h-32 text-mutedForeground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="text-left bg-tertiary/20 border-2 border-tertiary rounded-lg p-6 mb-8">
                  <h3 className="font-heading font-extrabold text-foreground mb-3">Installation Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-mutedForeground font-medium">
                    <li>Check your email ({email}) for your eSIM QR code</li>
                    <li>Open Settings on your device</li>
                    <li>Go to Cellular/Mobile Data</li>
                    <li>Tap "Add Cellular Plan" or "Add eSIM"</li>
                    <li>Scan the QR code from your email</li>
                    <li>Follow the on-screen instructions</li>
                  </ol>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-transparent hover:bg-tertiary text-foreground border-2 border-foreground px-6 py-3 rounded-full font-bold transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex-1 bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-6 py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Download Receipt
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  Need help? <a href="/support" className="text-primary hover:underline">Contact Support</a>
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            {step < 4 && <OrderSummary />}
          </div>
        </div>
      </div>
    </div>
  )
}
