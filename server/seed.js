const { db, initializeDatabase } = require('./database');

console.log('🌱 Seeding database with sample data...\n');

// Initialize database schema first
initializeDatabase();

// Clear existing data (in development)
const tables = [
  'support_tickets', 'order_items', 'orders', 'testimonials', 'faq_items',
  'promo_codes', 'packages', 'regional_packages', 'destinations', 'regions', 'customers'
];

tables.forEach(table => {
  db.prepare(`DELETE FROM ${table}`).run();
});

console.log('Cleared existing data\n');

// Seed regions
console.log('Seeding regions...');
const regions = [
  { name: 'Europe', slug: 'europe', description: 'European countries', display_order: 1 },
  { name: 'Asia Pacific', slug: 'asia-pacific', description: 'Asian and Pacific countries', display_order: 2 },
  { name: 'North America', slug: 'north-america', description: 'North American countries', display_order: 3 },
  { name: 'South America', slug: 'south-america', description: 'South American countries', display_order: 4 },
  { name: 'Africa', slug: 'africa', description: 'African countries', display_order: 5 },
  { name: 'Middle East', slug: 'middle-east', description: 'Middle Eastern countries', display_order: 6 },
  { name: 'Oceania', slug: 'oceania', description: 'Oceania countries', display_order: 7 }
];

const insertRegion = db.prepare('INSERT INTO regions (name, slug, description, display_order) VALUES (?, ?, ?, ?)');
regions.forEach(r => insertRegion.run(r.name, r.slug, r.description, r.display_order));
console.log(`✅ Seeded ${regions.length} regions\n`);

// Seed destinations
console.log('Seeding destinations...');
const destinations = [
  // Europe
  { region_id: 1, name: 'United Kingdom', slug: 'united-kingdom', country_code: 'GB', flag_emoji: '🇬🇧', is_popular: 1 },
  { region_id: 1, name: 'France', slug: 'france', country_code: 'FR', flag_emoji: '🇫🇷', is_popular: 1 },
  { region_id: 1, name: 'Germany', slug: 'germany', country_code: 'DE', flag_emoji: '🇩🇪', is_popular: 1 },
  { region_id: 1, name: 'Spain', slug: 'spain', country_code: 'ES', flag_emoji: '🇪🇸', is_popular: 1 },
  { region_id: 1, name: 'Italy', slug: 'italy', country_code: 'IT', flag_emoji: '🇮🇹', is_popular: 1 },
  { region_id: 1, name: 'Netherlands', slug: 'netherlands', country_code: 'NL', flag_emoji: '🇳🇱', is_popular: 0 },
  { region_id: 1, name: 'Switzerland', slug: 'switzerland', country_code: 'CH', flag_emoji: '🇨🇭', is_popular: 0 },
  { region_id: 1, name: 'Portugal', slug: 'portugal', country_code: 'PT', flag_emoji: '🇵🇹', is_popular: 0 },
  { region_id: 1, name: 'Greece', slug: 'greece', country_code: 'GR', flag_emoji: '🇬🇷', is_popular: 0 },
  { region_id: 1, name: 'Austria', slug: 'austria', country_code: 'AT', flag_emoji: '🇦🇹', is_popular: 0 },
  { region_id: 1, name: 'Belgium', slug: 'belgium', country_code: 'BE', flag_emoji: '🇧🇪', is_popular: 0 },
  { region_id: 1, name: 'Poland', slug: 'poland', country_code: 'PL', flag_emoji: '🇵🇱', is_popular: 0 },
  { region_id: 1, name: 'Czech Republic', slug: 'czech-republic', country_code: 'CZ', flag_emoji: '🇨🇿', is_popular: 0 },
  { region_id: 1, name: 'Ireland', slug: 'ireland', country_code: 'IE', flag_emoji: '🇮🇪', is_popular: 0 },
  { region_id: 1, name: 'Denmark', slug: 'denmark', country_code: 'DK', flag_emoji: '🇩🇰', is_popular: 0 },
  { region_id: 1, name: 'Sweden', slug: 'sweden', country_code: 'SE', flag_emoji: '🇸🇪', is_popular: 0 },
  { region_id: 1, name: 'Norway', slug: 'norway', country_code: 'NO', flag_emoji: '🇳🇴', is_popular: 0 },
  { region_id: 1, name: 'Finland', slug: 'finland', country_code: 'FI', flag_emoji: '🇫🇮', is_popular: 0 },

  // Asia Pacific
  { region_id: 2, name: 'Japan', slug: 'japan', country_code: 'JP', flag_emoji: '🇯🇵', is_popular: 1 },
  { region_id: 2, name: 'South Korea', slug: 'south-korea', country_code: 'KR', flag_emoji: '🇰🇷', is_popular: 1 },
  { region_id: 2, name: 'Thailand', slug: 'thailand', country_code: 'TH', flag_emoji: '🇹🇭', is_popular: 1 },
  { region_id: 2, name: 'Singapore', slug: 'singapore', country_code: 'SG', flag_emoji: '🇸🇬', is_popular: 0 },
  { region_id: 2, name: 'China', slug: 'china', country_code: 'CN', flag_emoji: '🇨🇳', is_popular: 0 },
  { region_id: 2, name: 'Hong Kong', slug: 'hong-kong', country_code: 'HK', flag_emoji: '🇭🇰', is_popular: 0 },
  { region_id: 2, name: 'Taiwan', slug: 'taiwan', country_code: 'TW', flag_emoji: '🇹🇼', is_popular: 0 },
  { region_id: 2, name: 'Vietnam', slug: 'vietnam', country_code: 'VN', flag_emoji: '🇻🇳', is_popular: 0 },
  { region_id: 2, name: 'Indonesia', slug: 'indonesia', country_code: 'ID', flag_emoji: '🇮🇩', is_popular: 0 },
  { region_id: 2, name: 'Malaysia', slug: 'malaysia', country_code: 'MY', flag_emoji: '🇲🇾', is_popular: 0 },
  { region_id: 2, name: 'Philippines', slug: 'philippines', country_code: 'PH', flag_emoji: '🇵🇭', is_popular: 0 },
  { region_id: 2, name: 'India', slug: 'india', country_code: 'IN', flag_emoji: '🇮🇳', is_popular: 0 },

  // North America
  { region_id: 3, name: 'United States', slug: 'united-states', country_code: 'US', flag_emoji: '🇺🇸', is_popular: 1 },
  { region_id: 3, name: 'Canada', slug: 'canada', country_code: 'CA', flag_emoji: '🇨🇦', is_popular: 0 },
  { region_id: 3, name: 'Mexico', slug: 'mexico', country_code: 'MX', flag_emoji: '🇲🇽', is_popular: 0 },

  // South America
  { region_id: 4, name: 'Brazil', slug: 'brazil', country_code: 'BR', flag_emoji: '🇧🇷', is_popular: 0 },
  { region_id: 4, name: 'Argentina', slug: 'argentina', country_code: 'AR', flag_emoji: '🇦🇷', is_popular: 0 },
  { region_id: 4, name: 'Chile', slug: 'chile', country_code: 'CL', flag_emoji: '🇨🇱', is_popular: 0 },
  { region_id: 4, name: 'Colombia', slug: 'colombia', country_code: 'CO', flag_emoji: '🇨🇴', is_popular: 0 },
  { region_id: 4, name: 'Peru', slug: 'peru', country_code: 'PE', flag_emoji: '🇵🇪', is_popular: 0 },

  // Africa
  { region_id: 5, name: 'South Africa', slug: 'south-africa', country_code: 'ZA', flag_emoji: '🇿🇦', is_popular: 0 },
  { region_id: 5, name: 'Egypt', slug: 'egypt', country_code: 'EG', flag_emoji: '🇪🇬', is_popular: 0 },
  { region_id: 5, name: 'Morocco', slug: 'morocco', country_code: 'MA', flag_emoji: '🇲🇦', is_popular: 0 },
  { region_id: 5, name: 'Kenya', slug: 'kenya', country_code: 'KE', flag_emoji: '🇰🇪', is_popular: 0 },
  { region_id: 5, name: 'Nigeria', slug: 'nigeria', country_code: 'NG', flag_emoji: '🇳🇬', is_popular: 0 },

  // Middle East
  { region_id: 6, name: 'United Arab Emirates', slug: 'uae', country_code: 'AE', flag_emoji: '🇦🇪', is_popular: 0 },
  { region_id: 6, name: 'Saudi Arabia', slug: 'saudi-arabia', country_code: 'SA', flag_emoji: '🇸🇦', is_popular: 0 },
  { region_id: 6, name: 'Turkey', slug: 'turkey', country_code: 'TR', flag_emoji: '🇹🇷', is_popular: 0 },
  { region_id: 6, name: 'Israel', slug: 'israel', country_code: 'IL', flag_emoji: '🇮🇱', is_popular: 0 },
  { region_id: 6, name: 'Qatar', slug: 'qatar', country_code: 'QA', flag_emoji: '🇶🇦', is_popular: 0 },

  // Oceania
  { region_id: 7, name: 'Australia', slug: 'australia', country_code: 'AU', flag_emoji: '🇦🇺', is_popular: 1 },
  { region_id: 7, name: 'New Zealand', slug: 'new-zealand', country_code: 'NZ', flag_emoji: '🇳🇿', is_popular: 0 },
  { region_id: 7, name: 'Fiji', slug: 'fiji', country_code: 'FJ', flag_emoji: '🇫🇯', is_popular: 0 }
];

const insertDestination = db.prepare(`
  INSERT INTO destinations (region_id, name, slug, country_code, flag_emoji, is_popular, coverage_quality)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const destinationsWithIds = destinations.map(d => {
  const result = insertDestination.run(d.region_id, d.name, d.slug, d.country_code, d.flag_emoji, d.is_popular, d.coverage_quality || 4);
  return { ...d, id: result.lastInsertRowid };
});
console.log(`✅ Seeded ${destinationsWithIds.length} destinations\n`);

// Seed packages for popular destinations
console.log('Seeding packages...');
const packageTemplates = [
  { data_amount: '1', validity_days: 7, price_multiplier: 1.0, is_popular: 0, network_type: '4G' },
  { data_amount: '3', validity_days: 15, price_multiplier: 2.0, is_popular: 0, network_type: '4G' },
  { data_amount: '5', validity_days: 30, price_multiplier: 3.0, is_popular: 1, network_type: '4G' },
  { data_amount: '10', validity_days: 30, price_multiplier: 5.0, is_popular: 0, network_type: '5G' },
  { data_amount: 'Unlimited', validity_days: 30, price_multiplier: 8.0, is_popular: 0, network_type: '5G' }
];

const countryBasePrices = {
  'united-states': 4.99,
  'japan': 5.99,
  'united-kingdom': 4.99,
  'thailand': 3.99,
  'france': 4.99,
  'australia': 5.99,
  'germany': 4.99,
  'south-korea': 5.99,
  'spain': 4.49,
  'italy': 4.49
};

const insertPackage = db.prepare(`
  INSERT INTO packages (destination_id, name, data_amount, data_unit, validity_days, price_usd, is_popular, network_type, tethering_allowed)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

let packageCount = 0;
destinationsWithIds.forEach(dest => {
  const basePrice = countryBasePrices[dest.slug] || 4.99;

  packageTemplates.forEach(template => {
    const price = template.data_amount === 'Unlimited'
      ? basePrice * template.price_multiplier
      : basePrice * template.price_multiplier;

    const packageName = `${template.data_amount}${template.data_amount !== 'Unlimited' ? 'GB' : ''} / ${template.validity_days} days`;

    insertPackage.run(
      dest.id,
      packageName,
      template.data_amount,
      template.data_amount === 'Unlimited' ? 'Unlimited' : 'GB',
      template.validity_days,
      Math.round(price * 100) / 100,
      template.is_popular,
      template.network_type
    );
    packageCount++;
  });
});
console.log(`✅ Seeded ${packageCount} packages\n`);

// Seed regional packages
console.log('Seeding regional packages...');
const regionalPackages = [
  {
    name: 'Europe 39',
    slug: 'europe-39',
    description: 'Covers all EU countries plus UK, Switzerland, and Norway',
    countries_included: JSON.stringify(['UK', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Portugal', 'Greece', 'Austria', 'Belgium', 'Poland', 'Czech Republic', 'Ireland', 'Denmark', 'Sweden', 'Norway', 'Finland', 'and 21 more']),
    packages: [
      { data_amount: '3GB', validity_days: 15, price_usd: 12.99 },
      { data_amount: '5GB', validity_days: 30, price_usd: 19.99 },
      { data_amount: '10GB', validity_days: 30, price_usd: 29.99 },
      { data_amount: 'Unlimited', validity_days: 30, price_usd: 49.99 }
    ]
  },
  {
    name: 'Asia 15',
    slug: 'asia-15',
    description: 'Covers major Asian destinations',
    countries_included: JSON.stringify(['Japan', 'South Korea', 'Thailand', 'Singapore', 'Hong Kong', 'Taiwan', 'Vietnam', 'Indonesia', 'Malaysia', 'Philippines', 'and 5 more']),
    packages: [
      { data_amount: '3GB', validity_days: 15, price_usd: 14.99 },
      { data_amount: '5GB', validity_days: 30, price_usd: 24.99 },
      { data_amount: '10GB', validity_days: 30, price_usd: 39.99 }
    ]
  }
];

const insertRegionalPackage = db.prepare(`
  INSERT INTO regional_packages (name, slug, description, countries_included, data_amount, validity_days, price_usd)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

regionalPackages.forEach(rp => {
  rp.packages.forEach(pkg => {
    insertRegionalPackage.run(
      rp.name,
      `${rp.slug}-${pkg.data_amount.toLowerCase()}`,
      rp.description,
      rp.countries_included,
      pkg.data_amount,
      pkg.validity_days,
      pkg.price_usd
    );
  });
});
console.log(`✅ Seeded regional packages\n`);

// Seed promo codes
console.log('Seeding promo codes...');
const promoCodes = [
  { code: 'WELCOME10', discount_type: 'percent', discount_value: 10, min_order_amount: 0, is_active: 1 },
  { code: 'TRAVEL20', discount_type: 'fixed', discount_value: 5, min_order_amount: 25, is_active: 1 },
  { code: 'SUMMER2024', discount_type: 'percent', discount_value: 15, min_order_amount: 0, is_active: 0, valid_until: '2024-09-01' }
];

const insertPromoCode = db.prepare(`
  INSERT INTO promo_codes (code, discount_type, discount_value, min_order_amount, is_active, valid_until)
  VALUES (?, ?, ?, ?, ?, ?)
`);

promoCodes.forEach(pc => {
  insertPromoCode.run(pc.code, pc.discount_type, pc.discount_value, pc.min_order_amount, pc.is_active, pc.valid_until || null);
});
console.log(`✅ Seeded ${promoCodes.length} promo codes\n`);

// Seed testimonials
console.log('Seeding testimonials...');
const testimonials = [
  { customer_name: 'Sarah M.', country: 'Canada', rating: 5, review_text: 'Used this in Japan for 2 weeks. Flawless connection everywhere I went!', destination_visited: 'Japan', is_featured: 1 },
  { customer_name: 'James L.', country: 'UK', rating: 5, review_text: 'So much easier than getting a local SIM. Set up in 5 minutes at the airport.', destination_visited: 'Thailand', is_featured: 1 },
  { customer_name: 'Maria G.', country: 'Spain', rating: 5, review_text: 'Great prices and excellent coverage across Europe. Highly recommend!', destination_visited: 'France', is_featured: 1 },
  { customer_name: 'David K.', country: 'USA', rating: 5, review_text: 'Perfect for my business trip to Germany. Fast 5G speeds and reliable.', destination_visited: 'Germany', is_featured: 1 },
  { customer_name: 'Linda W.', country: 'Australia', rating: 4, review_text: 'Good service overall. Had minor issues in remote areas but great in cities.', destination_visited: 'Italy', is_featured: 0 },
  { customer_name: 'Alex P.', country: 'Singapore', rating: 5, review_text: 'Used the regional Europe package for my multi-country trip. Worked perfectly!', destination_visited: 'Europe', is_featured: 1 }
];

const insertTestimonial = db.prepare(`
  INSERT INTO testimonials (customer_name, country, rating, review_text, destination_visited, is_featured)
  VALUES (?, ?, ?, ?, ?, ?)
`);

testimonials.forEach(t => {
  insertTestimonial.run(t.customer_name, t.country, t.rating, t.review_text, t.destination_visited, t.is_featured);
});
console.log(`✅ Seeded ${testimonials.length} testimonials\n`);

// Seed FAQ items
console.log('Seeding FAQ items...');
const faqItems = [
  { category: 'general', question: 'What is an eSIM?', answer: 'An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without having to use a physical SIM card. It\'s built into your device and can be programmed remotely.', display_order: 1 },
  { category: 'general', question: 'Which devices support eSIM?', answer: 'Most newer smartphones support eSIM including iPhone XS and later, Google Pixel 3 and later, Samsung Galaxy S20 and later, and many other devices. Check our compatibility list for details.', display_order: 2 },
  { category: 'installation', question: 'How do I install the eSIM?', answer: 'After purchasing, you\'ll receive a QR code via email. Go to your device settings, select "Add Cellular Plan" (iOS) or "Add Mobile Network" (Android), and scan the QR code. The eSIM will be installed automatically.', display_order: 1 },
  { category: 'general', question: 'Can I use my regular number alongside eSIM?', answer: 'Yes! Your device can have both a physical SIM and eSIM active at the same time. You can choose which line to use for calls, texts, and data.', display_order: 3 },
  { category: 'usage', question: 'What happens when I run out of data?', answer: 'When your data runs out, you can purchase a new package or top up. Your eSIM profile will remain on your device for easy reactivation.', display_order: 1 },
  { category: 'policies', question: 'Do you offer refunds?', answer: 'We offer refunds within 7 days if the eSIM hasn\'t been activated. Once activated, sales are final as the service has been provided.', display_order: 1 },
  { category: 'usage', question: 'Can I share my data (tethering)?', answer: 'Yes, most of our plans support tethering and mobile hotspot functionality. Check the specific plan details for confirmation.', display_order: 2 },
  { category: 'technical', question: 'How fast is the connection?', answer: 'Our eSIMs use the same networks as local carriers, providing 4G LTE and 5G speeds (where available). Speed depends on the local network and coverage in your area.', display_order: 1 }
];

const insertFAQ = db.prepare(`
  INSERT INTO faq_items (category, question, answer, display_order)
  VALUES (?, ?, ?, ?)
`);

faqItems.forEach(faq => {
  insertFAQ.run(faq.category, faq.question, faq.answer, faq.display_order);
});
console.log(`✅ Seeded ${faqItems.length} FAQ items\n`);

console.log('✅ Database seeding complete!\n');
console.log('Summary:');
console.log(`- ${regions.length} regions`);
console.log(`- ${destinations.length} destinations`);
console.log(`- ${packageCount} packages`);
console.log(`- ${regionalPackages.reduce((sum, rp) => sum + rp.packages.length, 0)} regional packages`);
console.log(`- ${promoCodes.length} promo codes`);
console.log(`- ${testimonials.length} testimonials`);
console.log(`- ${faqItems.length} FAQ items`);
