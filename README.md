# eSIM4Travel - Travel eSIM Provider
A fully functional mockup recreation of esim4travel.com - an eSIM provider offering affordable data packages for travelers across 190+ destinations worldwide.
## 🌟 Features
### Core Functionality
- **Destination Browser**: Browse and search 190+ destinations across 7 regions
- **Smart Search**: Real-time autocomplete search for countries
- **Data Packages**: Multiple data plans (1GB to Unlimited) with various validity periods
- **Shopping Cart**: Full cart management with promo code support
- **Checkout Flow**: Multi-step checkout with email and mock payment
- **User Accounts**: Registration, login, and order history
- **Regional eSIMs**: Multi-country packages for regions like Europe and Asia
- **Support Center**: Installation guides, FAQ, and contact form
### UI/UX Highlights
- **Mobile-first responsive design** optimized for all devices
- **Travel-inspired design** with teal and orange color scheme
- **Smooth animations** and transitions throughout
- **Intuitive navigation** with sticky header and mobile menu
- **Trust indicators** showcasing destinations, ratings, and support
## 🛠️ Technology Stack
### Frontend
- **React** with Vite for fast development
- **Tailwind CSS** for styling (via CDN)
- **React Router** for navigation
- **Heroicons/Lucide** for icons
### Backend
- **Node.js** with Express
- **SQLite** with better-sqlite3
- **Express Session** for cart management
- **bcrypt** for password hashing
## 📋 Prerequisites
- Node.js v18 or higher
- npm v8 or higher
## 🚀 Quick Start
1. **Run the initialization script:**
   ```bash
   ./init.sh
   ```
   This will:
   - Install all dependencies (frontend and backend)
   - Set up the development environment
   - Start both servers automatically
2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
## 📁 Project Structure
```
esim/
├── feature_list.json      # 200+ test cases for all features
├── init.sh                # Development environment setup script
├── README.md              # This file
├── server/                # Backend (Express + SQLite)
│   ├── index.js           # Main server file
│   ├── database.js        # Database setup and queries
│   ├── seed.js            # Sample data seeding
│   ├── routes/            # API route handlers
│   └── data/              # SQLite database file
└── frontend/              # Frontend (React + Vite)
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── context/       # React context for state
    │   └── App.jsx        # Main app component
    └── public/            # Static assets
```
## 🧪 Testing Progress
All features are tracked in `feature_list.json` with detailed test cases.
To check progress:
```bash
cat feature_list.json | grep -c '"passes": true'
```
## 🎯 Development Workflow
### For Future Agents:
1. **Check feature_list.json** to see what needs to be built
2. **Work on ONE feature at a time**
3. **Test thoroughly** before marking "passes": true
4. **Commit progress** frequently with descriptive messages
5. **Never remove or edit features** - only mark as passing
### Priority Order:
1. Database setup and seeding
2. Core API endpoints
3. Homepage and navigation
4. Destination browsing
5. Shopping cart
6. Checkout flow
7. Support and user accounts
8. Polish and optimization
## 📝 API Endpoints
### Destinations
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/popular` - Popular destinations
- `GET /api/destinations/search?q=query` - Search destinations
- `GET /api/destinations/:slug` - Get destination details
- `GET /api/destinations/:slug/packages` - Get packages for destination
### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `POST /api/cart/promo-code` - Apply promo code
### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/customers/orders` - Get customer order history
### More endpoints in app_spec.txt
## 🎨 Design System
### Colors
- **Primary**: Teal (#0D9488, #0F766E, #14B8A6)
- **Accent**: Orange (#F97316, #EA580C)
- **Background**: White (#FFFFFF), Light gray (#F9FAFB)
- **Text**: Dark gray (#111827), Medium gray (#6B7280)
### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold weight, responsive sizing
- **Body**: 16px base, relaxed line-height
### Components
- **Buttons**: Rounded-lg, px-6 py-3, teal primary
- **Cards**: Rounded-xl, subtle shadow, white background
- **Inputs**: Rounded-lg, teal focus ring
- **Badges**: Orange for "Most Popular"
## 📦 Sample Data
The database includes:
- **7 regions** (Europe, Asia, Americas, Africa, Oceania, Middle East)
- **50+ destinations** with realistic pricing
- **Multiple packages** per destination (1GB to Unlimited)
- **Regional packages** for multi-country coverage
- **Promo codes**: WELCOME10 (10% off), TRAVEL20 ($5 off $25+)
- **Testimonials** from satisfied customers
- **FAQ items** for common questions
## 🔒 Security Notes
- This is a **mockup/demo** application
- Passwords are hashed with bcrypt
- **No real payment processing**
- **No real eSIMs are delivered**
## 📄 License
Educational/demonstration project
## 🤝 Contributing
This is an autonomous coding project. Future AI agents will continue development based on feature_list.json.
---
**Current Status**: Initialized
**Last Updated**: Session 1
**Next Steps**: Begin implementing backend database and API endpoints
