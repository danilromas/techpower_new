const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Создание таблиц, если их нет
// Users
const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  role TEXT,
  status TEXT,
  lastLogin TEXT,
  createdAt TEXT
);`;
// Products
const productTable = `CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  brand TEXT,
  category TEXT,
  price INTEGER,
  stock INTEGER,
  image TEXT,
  description TEXT,
  specifications TEXT
);`;
// Orders
const orderTable = `CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT,
  phone TEXT,
  city TEXT,
  total INTEGER,
  status TEXT,
  date TEXT,
  items INTEGER,
  manager TEXT
);`;
// OrderItems (товары в заказе)
const orderItemTable = `CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId TEXT,
  productId INTEGER,
  name TEXT,
  price INTEGER,
  quantity INTEGER
);`;
// Customers
const customerTable = `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  totalOrders INTEGER,
  totalSpent INTEGER,
  lastOrder TEXT,
  status TEXT,
  registered TEXT
);`;
// Suppliers
const supplierTable = `CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  contact TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  rating REAL,
  deliveryTime TEXT,
  paymentTerms TEXT,
  status TEXT
);`;
// PCBuilds
const pcBuildTable = `CREATE TABLE IF NOT EXISTS pc_builds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  components TEXT,
  totalPrice INTEGER,
  markup INTEGER,
  markupType TEXT,
  finalPrice INTEGER,
  profit INTEGER,
  createdAt TEXT,
  status TEXT,
  isCompatible INTEGER
);`;
// Inventory
const inventoryTable = `CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  stock INTEGER,
  minStock INTEGER,
  price INTEGER,
  supplier TEXT
);`;

// Выполнение миграций
function migrate() {
  db.serialize(() => {
    db.run(userTable);
    db.run(productTable);
    db.run(orderTable);
    db.run(orderItemTable);
    db.run(customerTable);
    db.run(supplierTable);
    db.run(pcBuildTable);
    db.run(inventoryTable);
  });
}

module.exports = { db, migrate }; 