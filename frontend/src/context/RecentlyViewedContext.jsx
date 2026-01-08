import { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

const MAX_RECENT_ITEMS = 8;

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (destination) => {
    setRecentlyViewed(prev => {
      // Remove if already exists (to move it to front)
      const filtered = prev.filter(item => item.id !== destination.id);
      // Add to front with timestamp
      const newItem = {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        flag_emoji: destination.flag_emoji,
        min_price: destination.min_price || destination.starting_price,
        viewedAt: new Date().toISOString()
      };
      // Keep only the most recent items
      return [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
}
