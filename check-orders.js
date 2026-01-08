const Database = require('./server/node_modules/better-sqlite3');
const db = new Database('./server/data/esim4travel.db');

console.log('\n=== RECENT ORDERS ===');
const orders = db.prepare(`
  SELECT id, customer_id, email, total, status, created_at
  FROM orders
  ORDER BY created_at DESC
  LIMIT 5
`).all();
console.log(orders);

console.log('\n=== CUSTOMERS ===');
const customers = db.prepare(`
  SELECT id, email, first_name, last_name, created_at
  FROM customers
  ORDER BY created_at DESC
  LIMIT 5
`).all();
console.log(customers);

console.log('\n=== ORDER ITEMS FOR LATEST ORDER ===');
if (orders.length > 0) {
  const items = db.prepare(`
    SELECT * FROM order_items WHERE order_id = ?
  `).all(orders[0].id);
  console.log('Order ID:', orders[0].id);
  console.log('Items:', items);

  // Check all orders
  console.log('\n=== ALL ORDER ITEMS ===');
  const allItems = db.prepare(`
    SELECT order_id, COUNT(*) as item_count FROM order_items GROUP BY order_id
  `).all();
  console.log(allItems);
}

db.close();
