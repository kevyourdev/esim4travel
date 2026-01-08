import { useCart } from '../context/CartContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem, applyPromoCode, removePromoCode } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState(false)

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false)
      }
    }

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isCartOpen, setIsCartOpen])

  const handleApplyPromo = async () => {
    setPromoError('')
    setPromoSuccess(false)
    const result = await applyPromoCode(promoCode)
    if (result.success) {
      setPromoSuccess(true)
      setPromoCode('')
    } else {
      setPromoError(result.error)
    }
  }

  const handleRemovePromo = async () => {
    await removePromoCode()
    setPromoSuccess(false)
    setPromoError('')
  }

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l-2 border-foreground shadow-[8px_0px_0px_0px_rgba(30,41,59,1)] z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-foreground">
          <h2 className="text-2xl font-heading font-extrabold text-foreground">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center hover:rotate-12 transition-all duration-300 ease-bouncy"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                to="/destinations"
                onClick={() => setIsCartOpen(false)}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="bg-card border-2 border-foreground rounded-xl p-4 shadow-hard hover:-rotate-1 hover:scale-102 transition-all duration-300 ease-bouncy">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">{item.destination_flag}</span>
                        <h3 className="font-heading font-bold text-foreground">{item.destination_name}</h3>
                      </div>
                      <p className="text-sm text-mutedForeground font-medium">
                        {item.package_data_amount} {item.package_data_unit} · {item.package_validity_days} days
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center hover:rotate-12 hover:scale-110 transition-all duration-300 ease-bouncy"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-muted rounded-full p-1 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full bg-white border-2 border-foreground flex items-center justify-center hover:bg-tertiary hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-300 ease-bouncy"
                      >
                        <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-heading font-bold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white border-2 border-foreground flex items-center justify-center hover:bg-tertiary hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-300 ease-bouncy"
                      >
                        <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <p className="font-heading font-extrabold text-xl text-accent">${item.total_price.toFixed(2)}</p>
                  </div>
                </div>
              ))}

              {/* Promo Code */}
              <div className="pt-4 border-t-2 border-foreground">
                <label className="block text-xs font-heading font-bold uppercase tracking-wide text-foreground mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-foreground placeholder-mutedForeground font-medium focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] transition-all"
                    disabled={cart.promo_code}
                  />
                  {cart.promo_code ? (
                    <button
                      onClick={handleRemovePromo}
                      className="px-4 py-3 bg-white border-2 border-foreground rounded-full font-heading font-bold text-foreground hover:bg-tertiary hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-300 ease-bouncy"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyPromo}
                      className="px-6 py-3 bg-accent text-white border-2 border-foreground rounded-full font-heading font-bold shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] transition-all duration-300 ease-bouncy"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoError && (
                  <p className="text-sm text-red-500 mt-2">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-sm text-green-600 mt-2">Promo code applied!</p>
                )}
                {cart.promo_code && (
                  <p className="text-sm text-green-600 mt-2">Code "{cart.promo_code}" applied</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Totals */}
        {cart.items.length > 0 && (
          <div className="border-t-2 border-foreground p-6 bg-muted">
            <div className="space-y-2 mb-4">
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
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-accent text-white py-3 rounded-full font-heading font-bold border-2 border-foreground shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] transition-all duration-300 ease-bouncy text-center"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-accent hover:text-secondary font-heading font-bold mt-3 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
