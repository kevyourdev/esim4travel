const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'esim4travel.db');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Database deleted');
} else {
  console.log('ℹ️  Database does not exist');
}
