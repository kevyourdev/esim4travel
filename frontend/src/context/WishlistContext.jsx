import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (destination) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === destination.id)) {
        return prev;
      }
      return [...prev, {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        flag_emoji: destination.flag_emoji,
        starting_price: destination.starting_price || destination.min_price,
        addedAt: new Date().toISOString()
      }];
    });
  };

  const removeFromWishlist = (destinationId) => {
    setWishlist(prev => prev.filter(item => item.id !== destinationId));
  };

  const isInWishlist = (destinationId) => {
    return wishlist.some(item => item.id === destinationId);
  };

  const toggleWishlist = (destination) => {
    if (isInWishlist(destination.id)) {
      removeFromWishlist(destination.id);
    } else {
      addToWishlist(destination);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
