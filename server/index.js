require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');
const { db, initializeDatabase, queries } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'esim4travel-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Allow cookies over HTTP in development
    sameSite: 'lax', // Allow cookies in cross-origin requests
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'eSIM4Travel API is running' });
});

// ===== REGIONS ENDPOINTS =====
app.get('/api/regions', (req, res) => {
  try {
    const regions = queries.getAllRegions.all();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

app.get('/api/regions/:slug/destinations', (req, res) => {
  try {
    const region = queries.getRegionBySlug.get(req.params.slug);
    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }
    const destinations = queries.getDestinationsByRegion.all(region.id);
    res.json({ region, destinations, count: destinations.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// ===== DESTINATIONS ENDPOINTS =====
app.get('/api/destinations', (req, res) => {
  try {
    const { region } = req.query;

    if (region) {
      const regionData = queries.getRegionBySlug.get(region);
      if (!regionData) {
        return res.status(404).json({ error: 'Region not found' });
      }
      const destinations = queries.getDestinationsByRegion.all(regionData.id);
      return res.json(destinations);
    }

    const destinations = queries.getAllDestinations.all();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

app.get('/api/destinations/popular', (req, res) => {
  try {
    const destinations = queries.getPopularDestinations.all();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular destinations' });
  }
});

app.get('/api/destinations/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    const destinations = queries.searchDestinations.all(`%${q}%`);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/destinations/:slug', (req, res) => {
  try {
    const destination = queries.getDestinationBySlug.get(req.params.slug);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

app.get('/api/destinations/:slug/packages', (req, res) => {
  try {
    const destination = queries.getDestinationBySlug.get(req.params.slug);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    const packages = queries.getPackagesByDestination.all(destination.id);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// ===== PACKAGES ENDPOINTS =====
app.get('/api/packages/:id', (req, res) => {
  try {
    const pkg = queries.getPackageById.get(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Get destination info
    const destination = db.prepare('SELECT * FROM destinations WHERE id = ?').get(pkg.destination_id);
    res.json({ ...pkg, destination });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

// ===== REGIONAL PACKAGES ENDPOINTS =====
app.get('/api/regional-packages', (req, res) => {
  try {
    const packages = queries.getAllRegionalPackages.all();
    // Parse countries_included JSON string to array
    const parsedPackages = packages.map(pkg => {
      try {
        return {
          ...pkg,
          countries_included: JSON.parse(pkg.countries_included)
        };
      } catch (parseError) {
        console.error('Error parsing countries for package:', pkg.id, parseError);
        return {
          ...pkg,
          countries_included: []
        };
      }
    });
    res.json(parsedPackages);
  } catch (error) {
    console.error('Error fetching regional packages:', error);
    res.status(500).json({ error: 'Failed to fetch regional packages' });
  }
});

app.get('/api/regional-packages/:slug', (req, res) => {
  try {
    const pkg = queries.getRegionalPackageBySlug.get(req.params.slug);
    if (!pkg) {
      return res.status(404).json({ error: 'Regional package not found' });
    }
    // Parse countries_included JSON string to array
    pkg.countries_included = JSON.parse(pkg.countries_included);
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regional package' });
  }
});

// ===== CART ENDPOINTS =====
app.get('/api/cart', (req, res) => {
  try {
    console.log('GET CART - Session ID:', req.sessionID, 'Cart items:', req.session.cart?.items?.length || 0);
    const cart = req.session.cart || { items: [], subtotal: 0, discount: 0, total: 0, promoCode: null };
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart/items', (req, res) => {
  try {
    const { packageId, quantity = 1, type = 'regular' } = req.body;
    console.log('ADD TO CART - Session ID:', req.sessionID, 'packageId:', packageId, 'quantity:', quantity, 'type:', type);

    let pkg = null;
    let destination = null;
    let isRegional = false;

    // Check the appropriate table based on type
    if (type === 'regional') {
      pkg = db.prepare('SELECT * FROM regional_packages WHERE id = ?').get(packageId);
      if (!pkg) {
        return res.status(404).json({ error: 'Regional package not found' });
      }
      isRegional = true;
      // Parse countries_included if it's a string
      if (pkg.countries_included && typeof pkg.countries_included === 'string') {
        pkg.countries_included = JSON.parse(pkg.countries_included);
      }
    } else {
      // Regular package
      pkg = queries.getPackageById.get(packageId);
      if (!pkg) {
        return res.status(404).json({ error: 'Package not found' });
      }
      // Get destination for regular packages
      destination = db.prepare('SELECT * FROM destinations WHERE id = ?').get(pkg.destination_id);
    }

    // Initialize cart if needed
    if (!req.session.cart) {
      req.session.cart = { items: [], subtotal: 0, discount: 0, total: 0, promoCode: null };
    }

    // Check if item already in cart (must match both package_id AND type)
    const existingItemIndex = req.session.cart.items.findIndex(item =>
      item.package_id === packageId && item.is_regional === isRegional
    );

    if (existingItemIndex >= 0) {
      req.session.cart.items[existingItemIndex].quantity += quantity;
    } else {
      req.session.cart.items.push({
        id: Date.now(),
        package_id: packageId,
        destination_name: isRegional ? pkg.name : destination.name,
        destination_flag: isRegional ? '🌍' : destination.flag_emoji,
        package_name: isRegional ? `${pkg.data_amount} • ${pkg.validity_days} days` : pkg.name,
        package_data_amount: pkg.data_amount,
        package_data_unit: isRegional ? '' : (pkg.data_unit || ''),
        package_validity_days: pkg.validity_days,
        unit_price: pkg.price_usd,
        quantity,
        total_price: pkg.price_usd * quantity,
        is_regional: isRegional
      });
    }

    // Recalculate totals
    recalculateCart(req.session.cart);

    res.status(201).json(req.session.cart);
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.put('/api/cart/items/:id', (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = parseInt(req.params.id);

    if (!req.session.cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = req.session.cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      req.session.cart.items.splice(itemIndex, 1);
    } else {
      req.session.cart.items[itemIndex].quantity = quantity;
    }

    recalculateCart(req.session.cart);
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

app.delete('/api/cart/items/:id', (req, res) => {
  try {
    const itemId = parseInt(req.params.id);

    if (!req.session.cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = req.session.cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    req.session.cart.items.splice(itemIndex, 1);
    recalculateCart(req.session.cart);

    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

app.post('/api/cart/promo-code', (req, res) => {
  try {
    const { code } = req.body;

    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const promoCode = queries.getPromoCode.get(code);
    if (!promoCode) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    // Check if expired
    if (promoCode.valid_until && new Date(promoCode.valid_until) < new Date()) {
      return res.status(400).json({ error: 'Promo code has expired' });
    }

    // Check minimum order amount
    if (req.session.cart.subtotal < promoCode.min_order_amount) {
      return res.status(400).json({ error: `Minimum order amount is $${promoCode.min_order_amount}` });
    }

    req.session.cart.promoCode = {
      code: promoCode.code,
      discountType: promoCode.discount_type,
      discountValue: promoCode.discount_value
    };

    recalculateCart(req.session.cart);
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply promo code' });
  }
});

app.delete('/api/cart/promo-code', (req, res) => {
  try {
    if (!req.session.cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    req.session.cart.promoCode = null;
    recalculateCart(req.session.cart);
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove promo code' });
  }
});

// Helper function to recalculate cart totals
function recalculateCart(cart) {
  // Update total_price for each item and calculate subtotal
  cart.subtotal = 0;
  cart.items.forEach(item => {
    item.total_price = Math.round(item.unit_price * item.quantity * 100) / 100;
    cart.subtotal += item.total_price;
  });

  if (cart.promoCode) {
    if (cart.promoCode.discountType === 'percent') {
      cart.discount = cart.subtotal * (cart.promoCode.discountValue / 100);
    } else {
      cart.discount = cart.promoCode.discountValue;
    }
  } else {
    cart.discount = 0;
  }

  cart.total = Math.max(0, cart.subtotal - cart.discount);

  // Round to 2 decimal places
  cart.subtotal = Math.round(cart.subtotal * 100) / 100;
  cart.discount = Math.round(cart.discount * 100) / 100;
  cart.total = Math.round(cart.total * 100) / 100;
}

// ===== CHECKOUT ENDPOINTS =====
app.post('/api/checkout/validate', (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: 'Validation failed' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { email, customerData } = req.body;

    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cart = req.session.cart;

    // Create order
    const createOrder = db.prepare(`
      INSERT INTO orders (customer_id, email, status, subtotal, discount, total, promo_code_used)
      VALUES (?, ?, 'completed', ?, ?, ?, ?)
    `);

    const orderResult = createOrder.run(
      req.session.customerId || null,
      email,
      cart.subtotal,
      cart.discount,
      cart.total,
      cart.promoCode ? cart.promoCode.code : null
    );

    const orderId = orderResult.lastInsertRowid;

    // Create order items
    const createOrderItem = db.prepare(`
      INSERT INTO order_items (order_id, package_id, destination_name, package_name, quantity, unit_price, total_price, qr_code_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    cart.items.forEach(item => {
      const qrCodeData = JSON.stringify({
        orderId,
        packageId: item.package_id,
        destination: item.destination_name,
        package: item.package_name,
        activationCode: `ESIM-${orderId}-${item.package_id}-${Math.random().toString(36).substring(7).toUpperCase()}`
      });

      createOrderItem.run(
        orderId,
        item.package_id,
        item.destination_name,
        item.package_name,
        item.quantity,
        item.unit_price,
        item.unit_price * item.quantity,
        qrCodeData
      );
    });

    // Clear cart
    req.session.cart = { items: [], subtotal: 0, discount: 0, total: 0, promoCode: null };

    // Get complete order
    const order = queries.getOrderById.get(orderId);
    const orderItems = queries.getOrderItems.all(orderId);

    res.status(201).json({ order, orderItems });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = queries.getOrderById.get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderItems = queries.getOrderItems.all(req.params.id);
    res.json({ ...order, items: orderItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.get('/api/orders/:id/qr-code', async (req, res) => {
  try {
    const orderItems = queries.getOrderItems.all(req.params.id);
    if (!orderItems || orderItems.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate actual QR codes as data URLs
    const qrCodes = await Promise.all(orderItems.map(async (item) => {
      const qrData = JSON.parse(item.qr_code_data);
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#1E293B',  // Dark color matching the design
          light: '#FFFFFF'
        }
      });
      return {
        ...qrData,
        qrCodeImage: qrCodeDataUrl
      };
    }));

    res.json({ qrCodes });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// ===== AUTH ENDPOINTS =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email exists
    const existing = queries.getCustomerByEmail.get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create customer
    const createCustomer = db.prepare(`
      INSERT INTO customers (email, password_hash, first_name, last_name)
      VALUES (?, ?, ?, ?)
    `);

    const result = createCustomer.run(email, passwordHash, firstName, lastName);
    const customerId = result.lastInsertRowid;

    // Set session
    req.session.customerId = customerId;
    req.session.customerEmail = email;

    const customer = queries.getCustomerById.get(customerId);
    const { password_hash, ...customerData } = customer;

    res.status(201).json({ customer: customerData });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = queries.getCustomerByEmail.get(email);
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, customer.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    db.prepare('UPDATE customers SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(customer.id);

    // Set session
    req.session.customerId = customer.id;
    req.session.customerEmail = customer.email;

    const { password_hash, ...customerData } = customer;
    res.json({ customer: customerData });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.customerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const customer = queries.getCustomerById.get(req.session.customerId);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const { password_hash, ...customerData } = customer;
  res.json({ customer: customerData });
});

app.get('/api/customers/orders', (req, res) => {
  if (!req.session.customerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const orders = queries.getOrdersByCustomer.all(req.session.customerId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ===== PASSWORD RESET ENDPOINTS =====
// In-memory storage for reset tokens (in production, use Redis or database)
const passwordResetTokens = new Map();

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const customer = queries.getCustomerByEmail.get(email);

    // Always return success to prevent email enumeration
    if (!customer) {
      return res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    }

    // Generate reset token (6-digit code for simplicity)
    const resetToken = Math.random().toString().slice(2, 8);
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store token (in production, store in database)
    passwordResetTokens.set(email, { token: resetToken, expiresAt, customerId: customer.id });

    // In production, send email with reset link/code
    // For demo purposes, log the token
    console.log(`Password reset token for ${email}: ${resetToken}`);

    // In dev mode, return token for testing
    const response = {
      message: 'If an account exists with this email, a reset link has been sent.'
    };
    if (process.env.NODE_ENV !== 'production') {
      response.resetToken = resetToken;
    }
    res.json(response);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Email, token, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Verify token
    const resetData = passwordResetTokens.get(email);

    if (!resetData) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (resetData.token !== token) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    if (Date.now() > resetData.expiresAt) {
      passwordResetTokens.delete(email);
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password and update
    const passwordHash = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE customers SET password_hash = ? WHERE id = ?').run(passwordHash, resetData.customerId);

    // Remove used token
    passwordResetTokens.delete(email);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.put('/api/customers/me', (req, res) => {
  if (!req.session.customerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { firstName, lastName } = req.body;

  // Validate input
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  if (firstName.trim().length === 0 || lastName.trim().length === 0) {
    return res.status(400).json({ error: 'First name and last name cannot be empty' });
  }

  try {
    // Update customer information
    const updateStmt = db.prepare('UPDATE customers SET first_name = ?, last_name = ? WHERE id = ?');
    updateStmt.run(firstName.trim(), lastName.trim(), req.session.customerId);

    // Return updated customer data
    const customer = queries.getCustomerById.get(req.session.customerId);
    res.json({
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      createdAt: customer.created_at
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer information' });
  }
});

// ===== SUPPORT ENDPOINTS =====
app.get('/api/faq', (req, res) => {
  try {
    const faqItems = queries.getAllFAQ.all();
    res.json(faqItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

app.get('/api/faq/:category', (req, res) => {
  try {
    const faqItems = queries.getFAQByCategory.all(req.params.category);
    res.json(faqItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

app.post('/api/support/tickets', (req, res) => {
  try {
    const { email, orderId, category, subject, message } = req.body;

    if (!email || !category || !message) {
      return res.status(400).json({ error: 'Email, category, and message are required' });
    }

    const result = queries.createSupportTicket.run(
      email,
      orderId || null,
      category,
      subject || 'Support Request',
      message
    );

    res.status(201).json({ ticketId: result.lastInsertRowid, message: 'Support ticket created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

app.get('/api/installation-guides', (req, res) => {
  res.json({
    ios: {
      title: 'iPhone Installation Guide',
      steps: [
        'Open the email containing your QR code',
        'Go to Settings > Cellular/Mobile Data',
        'Tap "Add Cellular Plan"',
        'Scan the QR code with your camera',
        'Tap "Add Cellular Plan" when prompted',
        'Label your plan (e.g., "Travel eSIM")',
        'Choose which line to use for cellular data',
        'Your eSIM is now installed and ready to use'
      ]
    },
    android: {
      title: 'Android Installation Guide',
      steps: [
        'Open the email containing your QR code',
        'Go to Settings > Network & Internet > Mobile Network',
        'Tap the + icon to add a network',
        'Select "Scan carrier QR code"',
        'Scan the QR code with your camera',
        'Tap "Download" to install the eSIM',
        'Enable the eSIM in your settings',
        'Your eSIM is now installed and ready to use'
      ]
    },
    compatibleDevices: [
      'iPhone XS, XR and later models',
      'Google Pixel 3 and later',
      'Samsung Galaxy S20 and later',
      'Samsung Galaxy Note 20 and later',
      'iPad Pro (2018 and later)',
      'iPad Air (2019 and later)',
      'iPad Mini (2019 and later)'
    ]
  });
});

// ===== CONTENT ENDPOINTS =====
app.get('/api/testimonials', (req, res) => {
  try {
    const testimonials = queries.getFeaturedTestimonials.all();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = queries.getStats.get();
    res.json({
      destinations: '190+',
      travelers: '2M+',
      rating: 4.8,
      support: '24/7',
      delivery: 'Instant',
      actualDestinations: stats.total_destinations,
      actualOrders: stats.total_orders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌍 eSIM4Travel API Server`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
});
