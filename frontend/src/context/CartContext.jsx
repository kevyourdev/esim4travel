import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
// Updated to support regional packages

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, discount: 0, total: 0 })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  const API_URL = 'http://localhost:3001'

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setCart(data)
        updateItemCount(data.items)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const updateItemCount = (items) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    setItemCount(count)
  }

  const addToCart = async (packageId, type = 'regular') => {
    try {
      const response = await fetch(`${API_URL}/api/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ packageId: packageId, quantity: 1, type: type })
      })
      if (response.ok) {
        await fetchCart()
        setIsCartOpen(true)
        return true
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
    return false
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity })
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const applyPromoCode = async (code) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/promo-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code })
      })
      if (response.ok) {
        await fetchCart()
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('Error applying promo code:', error)
      return { success: false, error: 'Failed to apply promo code' }
    }
  }

  const removePromoCode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart/promo-code`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Error removing promo code:', error)
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeItem,
      applyPromoCode,
      removePromoCode,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
