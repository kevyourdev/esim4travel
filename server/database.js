const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'esim4travel.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  console.log('Initializing database schema...');

  // Regions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS regions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Destinations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      country_code TEXT,
      flag_emoji TEXT,
      hero_image_url TEXT,
      description TEXT,
      coverage_quality INTEGER DEFAULT 4,
      is_popular INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (region_id) REFERENCES regions(id)
    )
  `);

  // Packages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      data_amount TEXT NOT NULL,
      data_unit TEXT DEFAULT 'GB',
      validity_days INTEGER NOT NULL,
      price_usd REAL NOT NULL,
      is_popular INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      network_type TEXT DEFAULT '4G',
      tethering_allowed INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (destination_id) REFERENCES destinations(id)
    )
  `);

  // Regional packages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS regional_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      countries_included TEXT,
      data_amount TEXT NOT NULL,
      validity_days INTEGER NOT NULL,
      price_usd REAL NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      email TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      promo_code_used TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      package_id INTEGER NOT NULL,
      destination_name TEXT NOT NULL,
      package_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      qr_code_data TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (package_id) REFERENCES packages(id)
    )
  `);

  // Promo codes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS promo_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_order_amount REAL DEFAULT 0,
      usage_limit INTEGER,
      times_used INTEGER DEFAULT 0,
      valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
      valid_until DATETIME,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Testimonials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      country TEXT,
      rating INTEGER DEFAULT 5,
      review_text TEXT,
      destination_visited TEXT,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // FAQ items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS faq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Support tickets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_email TEXT NOT NULL,
      order_id INTEGER,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  console.log('✅ Database schema initialized successfully');
}

// Function to get prepared queries (call after initializeDatabase)
function getQueries() {
  return {
    // Regions
    getAllRegions: db.prepare('SELECT * FROM regions WHERE is_active = 1 ORDER BY display_order'),
    getRegionBySlug: db.prepare('SELECT * FROM regions WHERE slug = ? AND is_active = 1'),

    // Destinations
    getAllDestinations: db.prepare(`
      SELECT
        d.*,
        r.slug as region_slug,
        r.name as region_name,
        (SELECT MIN(price_usd) FROM packages WHERE destination_id = d.id AND is_active = 1) as min_price,
        (SELECT COUNT(*) FROM packages WHERE destination_id = d.id AND is_active = 1) as package_count
      FROM destinations d
      LEFT JOIN regions r ON d.region_id = r.id
      WHERE d.is_active = 1
      ORDER BY d.name
    `),
    getPopularDestinations: db.prepare(`
      SELECT
        d.*,
        r.slug as region_slug,
        r.name as region_name,
        (SELECT MIN(price_usd) FROM packages WHERE destination_id = d.id AND is_active = 1) as min_price,
        (SELECT COUNT(*) FROM packages WHERE destination_id = d.id AND is_active = 1) as package_count
      FROM destinations d
      LEFT JOIN regions r ON d.region_id = r.id
      WHERE d.is_popular = 1 AND d.is_active = 1
      ORDER BY d.name
      LIMIT 8
    `),
    getDestinationBySlug: db.prepare(`
      SELECT
        d.*,
        r.slug as region_slug,
        r.name as region_name
      FROM destinations d
      LEFT JOIN regions r ON d.region_id = r.id
      WHERE d.slug = ? AND d.is_active = 1
    `),
    getDestinationsByRegion: db.prepare(`
      SELECT
        d.*,
        r.slug as region_slug,
        r.name as region_name,
        (SELECT MIN(price_usd) FROM packages WHERE destination_id = d.id AND is_active = 1) as min_price,
        (SELECT COUNT(*) FROM packages WHERE destination_id = d.id AND is_active = 1) as package_count
      FROM destinations d
      LEFT JOIN regions r ON d.region_id = r.id
      WHERE d.region_id = ? AND d.is_active = 1
      ORDER BY d.name
    `),
    searchDestinations: db.prepare(`
      SELECT
        d.*,
        r.slug as region_slug,
        r.name as region_name,
        (SELECT MIN(price_usd) FROM packages WHERE destination_id = d.id AND is_active = 1) as min_price,
        (SELECT COUNT(*) FROM packages WHERE destination_id = d.id AND is_active = 1) as package_count
      FROM destinations d
      LEFT JOIN regions r ON d.region_id = r.id
      WHERE d.name LIKE ? AND d.is_active = 1
      ORDER BY d.name
      LIMIT 20
    `),

    // Packages
    getPackageById: db.prepare('SELECT * FROM packages WHERE id = ? AND is_active = 1'),
    getPackagesByDestination: db.prepare('SELECT * FROM packages WHERE destination_id = ? AND is_active = 1 ORDER BY price_usd'),

    // Regional packages
    getAllRegionalPackages: db.prepare('SELECT * FROM regional_packages WHERE is_active = 1'),
    getRegionalPackageBySlug: db.prepare('SELECT * FROM regional_packages WHERE slug = ? AND is_active = 1'),

    // Customers
    getCustomerByEmail: db.prepare('SELECT * FROM customers WHERE email = ?'),
    getCustomerById: db.prepare('SELECT * FROM customers WHERE id = ?'),

    // Orders
    getOrderById: db.prepare('SELECT * FROM orders WHERE id = ?'),
    getOrdersByCustomer: db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC'),
    getOrderItems: db.prepare('SELECT * FROM order_items WHERE order_id = ?'),

    // Promo codes
    getPromoCode: db.prepare('SELECT * FROM promo_codes WHERE code = ? AND is_active = 1'),

    // Testimonials
    getAllTestimonials: db.prepare('SELECT * FROM testimonials ORDER BY is_featured DESC, created_at DESC'),
    getFeaturedTestimonials: db.prepare('SELECT * FROM testimonials WHERE is_featured = 1 ORDER BY created_at DESC LIMIT 6'),

    // FAQ
    getAllFAQ: db.prepare('SELECT * FROM faq_items WHERE is_active = 1 ORDER BY category, display_order'),
    getFAQByCategory: db.prepare('SELECT * FROM faq_items WHERE category = ? AND is_active = 1 ORDER BY display_order'),

    // Support tickets
    createSupportTicket: db.prepare(`
      INSERT INTO support_tickets (customer_email, order_id, category, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `),

    // Stats
    getStats: db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM destinations WHERE is_active = 1) as total_destinations,
        (SELECT COUNT(*) FROM orders WHERE status = 'completed') as total_orders
    `)
  };
}

// Lazy-loaded queries
let queriesCache = null;

module.exports = {
  db,
  initializeDatabase,
  get queries() {
    if (!queriesCache) {
      queriesCache = getQueries();
    }
    return queriesCache;
  }
};
