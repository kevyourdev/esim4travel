# eSIM4Travel
A full-stack travel eSIM e-commerce platform built with React and Express.js, featuring a playful geometric design system inspired by Memphis design.
## Features
### Core Functionality
- **Destination Browser** - Browse 190+ destinations across 7 regions with filtering and search
- **Smart Search** - Real-time autocomplete with instant results
- **Data Packages** - Multiple plans (1GB to Unlimited) with various validity periods
- **Shopping Cart** - Slide-out drawer with quantity controls and promo codes
- **Checkout Flow** - Multi-step process with email, payment (mock), and confirmation
- **User Accounts** - Registration, login, password reset, and order history
- **Regional eSIMs** - Multi-country packages for Europe, Asia, and more
- **Real QR Codes** - Generated server-side for eSIM activation
- **Support Center** - Installation guides, FAQ, and contact form
### Design System
The UI features a **Playful Geometric Design System** with:
- Bold colors (Purple, Pink, Yellow, Teal accents)
- Hard shadow effects on interactive elements
- Rounded corners and playful shapes
- Smooth animations and transitions
- Memphis-inspired decorative elements
## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | SQLite (better-sqlite3) |
| Auth | bcrypt, express-session |
| QR Codes | qrcode (npm) |
## Quick Start
```bash
# Clone the repo
git clone https://github.com/kevyourdev/esim4travel.git
cd esim4travel

# Run the init script (installs deps and starts servers)
./init.sh
```
Or manually:
```bash
# Backend
cd server && npm install && node index.js

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```
**Access:**
- Frontend: http://localhost:5173
- API: http://localhost:3001
## Project Structure
```
esim4travel/
├── frontend/
│   ├── src/
│   │   ├── components/     # Header, Footer, CartDrawer, LoginModal
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── pages/          # All page components
│   │   └── App.jsx         # Routes and layout
│   └── vite.config.js
├── server/
│   ├── index.js            # Express app and all routes
│   ├── database.js         # SQLite setup and queries
│   ├── seed.js             # Sample data seeding
│   └── data/               # SQLite database file
└── README.md
```
## API Endpoints
### Destinations
```
GET  /api/destinations              # List all (with ?region= filter)
GET  /api/destinations/popular      # Featured destinations
GET  /api/destinations/search?q=    # Search by name
GET  /api/destinations/:slug        # Single destination
GET  /api/destinations/:slug/packages  # Packages for destination
```
### Cart & Checkout
```
GET    /api/cart                    # Get cart (session-based)
POST   /api/cart/items              # Add item
PUT    /api/cart/items/:id          # Update quantity
DELETE /api/cart/items/:id          # Remove item
POST   /api/cart/promo-code         # Apply promo
POST   /api/orders                  # Create order
GET    /api/orders/:id/qr-code      # Get QR codes for order
```
### Auth
```
POST /api/auth/register             # Create account
POST /api/auth/login                # Login
POST /api/auth/logout               # Logout
GET  /api/auth/me                   # Current user
POST /api/auth/forgot-password      # Request reset token
POST /api/auth/reset-password       # Reset with token
```
### Content
```
GET /api/regions                    # All regions
GET /api/regional-packages          # Multi-country packages
GET /api/testimonials               # Customer reviews
GET /api/faq                        # FAQ items
GET /api/stats                      # Trust indicators
```
## Sample Data
### Promo Codes
| Code | Discount |
|------|----------|
| WELCOME10 | 10% off |
| TRAVEL20 | $5 off orders $25+ |
### Test Account
```
Email: testuser@example.com
Password: (check database or register new)
```
## Screenshots
The app features:
- Animated hero section with search
- Destination cards with flag emojis
- Package selection with "Most Popular" badges
- Slide-out cart drawer
- Multi-step checkout with progress indicator
- Order confirmation with real QR codes
- Testimonials carousel with auto-advance
- Collapsible FAQ accordion
## Development
### Running Tests
```bash
# Auth tests
node test-auth.js

# Order tests
node test-order.js

# API endpoint tests
node test-api-endpoint.js
```
### Database
Reset and reseed:
```bash
cd server
node reset-db.js
node seed.js
```
## License
MIT
## Contributing
Pull requests welcome. For major changes, open an issue first.
