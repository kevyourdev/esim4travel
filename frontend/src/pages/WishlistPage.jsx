import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-foreground">My Wishlist</h1>
            <p className="text-mutedForeground mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'destination' : 'destinations'} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="bg-card rounded-xl border-2 border-foreground shadow-hard p-12 text-center">
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-mutedForeground mb-6">Save destinations you're interested in for easy access later.</p>
            <Link
              to="/destinations"
              className="inline-block bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-6 py-3 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy"
            >
              Browse Destinations
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border-2 border-foreground shadow-hard p-4 flex items-center gap-4 hover:shadow-hard-lg transition-all duration-300"
              >
                {/* Flag */}
                <div className="text-4xl">{item.flag_emoji}</div>

                {/* Info */}
                <div className="flex-1">
                  <Link
                    to={`/destinations/${item.slug}`}
                    className="font-heading font-bold text-lg text-foreground hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-accent font-bold">
                    From ${item.starting_price?.toFixed(2) || 'N/A'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Link
                    to={`/destinations/${item.slug}`}
                    className="bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground px-4 py-2 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy text-sm"
                  >
                    View Plans
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-10 h-10 rounded-full bg-secondary/10 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-all duration-300"
                    title="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/destinations"
            className="text-accent hover:text-accent/80 font-semibold transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  )
}
