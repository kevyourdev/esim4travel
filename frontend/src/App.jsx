import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DestinationsPage from './pages/DestinationsPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import CheckoutPage from './pages/CheckoutPage'
import SupportPage from './pages/SupportPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import RegionalESIMsPage from './pages/RegionalESIMsPage'
import RegionalPackageDetailPage from './pages/RegionalPackageDetailPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPolicyPage from './pages/RefundPolicyPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/regional" element={<RegionalESIMsPage />} />
                <Route path="/regional/:slug" element={<RegionalPackageDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/account" element={<AccountSettingsPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/refund" element={<RefundPolicyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
