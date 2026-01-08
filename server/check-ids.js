const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'esim4travel.db');
const db = new Database(dbPath);

console.log('\n=== REGIONAL PACKAGES ===');
const regionalPackages = db.prepare('SELECT id, name, slug, data_amount, validity_days, price_usd FROM regional_packages ORDER BY id').all();
regionalPackages.forEach(pkg => {
  console.log(`ID: ${pkg.id} | ${pkg.name} | ${pkg.slug} | ${pkg.data_amount} • ${pkg.validity_days} days | $${pkg.price_usd}`);
});

console.log('\n=== REGULAR PACKAGES (first 10) ===');
const regularPackages = db.prepare('SELECT p.id, d.name as destination, p.name as package_name, p.data_amount, p.validity_days, p.price_usd FROM packages p JOIN destinations d ON p.destination_id = d.id ORDER BY p.id LIMIT 10').all();
regularPackages.forEach(pkg => {
  console.log(`ID: ${pkg.id} | ${pkg.destination} | ${pkg.package_name} | ${pkg.data_amount} • ${pkg.validity_days} days | $${pkg.price_usd}`);
});

db.close();
