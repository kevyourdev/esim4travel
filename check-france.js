const { db } = require('./server/database');

console.log('Checking for France in database...');

const france = db.prepare('SELECT * FROM destinations WHERE slug = ?').get('france');
if (france) {
  console.log('✅ France found:', JSON.stringify(france, null, 2));

  const packages = db.prepare('SELECT * FROM packages WHERE destination_id = ?').all(france.id);
  console.log(`\n📦 France has ${packages.length} packages`);
} else {
  console.log('❌ France not found in database');

  console.log('\nAll destinations:');
  const all = db.prepare('SELECT id, name, slug FROM destinations LIMIT 10').all();
  console.log(all);
}
