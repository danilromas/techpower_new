const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { migrate } = require('./database');

const app = express();
const PORT = 3001;
const SECRET = 'supersecret';

app.use(cors());
app.use(bodyParser.json());

// Инициализация базы данных
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к SQLite базе данных.');
  }
});

migrate();

// Жёстко заданные тестовые пользователи
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'manager', password: 'manager123', role: 'manager' },
  { id: 3, username: 'user', password: 'user123', role: 'user' },
];

// Middleware для проверки JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Эндпоинт для логина
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Пример тестового эндпоинта
app.get('/', (req, res) => {
  res.json({ message: 'Backend работает!' });
});

// Пример защищённого эндпоинта
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Доступ разрешён', user: req.user });
});

// PRODUCTS CRUD
// Получить все продукты
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Получить продукт по id
app.get('/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});
// Создать продукт
app.post('/products', authenticateToken, (req, res) => {
  const { name, brand, category, price, stock, image, description, specifications } = req.body;
  db.run(
    'INSERT INTO products (name, brand, category, price, stock, image, description, specifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, brand, category, price, stock, image, description, specifications],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
// Обновить продукт
app.put('/products/:id', authenticateToken, (req, res) => {
  const { name, brand, category, price, stock, image, description, specifications } = req.body;
  db.run(
    'UPDATE products SET name=?, brand=?, category=?, price=?, stock=?, image=?, description=?, specifications=? WHERE id=?',
    [name, brand, category, price, stock, image, description, specifications, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
// Удалить продукт
app.delete('/products/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM products WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// PRODUCTS: поиск и фильтрация
app.get('/products/search', (req, res) => {
  const { name, category } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  let params = [];
  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PCBUILDS CRUD
// Получить все сборки ПК
app.get('/pcbuilds', (req, res) => {
  db.all('SELECT * FROM pc_builds', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Десериализация components
    rows = rows.map(row => ({ ...row, components: JSON.parse(row.components || '[]'), isCompatible: !!row.isCompatible }));
    res.json(rows);
  });
});
// Получить сборку по id
app.get('/pcbuilds/:id', (req, res) => {
  db.get('SELECT * FROM pc_builds WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'PCBuild not found' });
    row.components = JSON.parse(row.components || '[]');
    row.isCompatible = !!row.isCompatible;
    res.json(row);
  });
});
// Создать сборку ПК
app.post('/pcbuilds', authenticateToken, (req, res) => {
  const { name, description, components, totalPrice, markup, markupType, isCompatible } = req.body;
  db.run(
    'INSERT INTO pc_builds (name, description, components, totalPrice, markup, markupType, finalPrice, profit, createdAt, status, isCompatible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      description || '',
      JSON.stringify(components),
      totalPrice,
      markup,
      markupType,
      0, // finalPrice (можно рассчитать на фронте)
      0, // profit (можно рассчитать на фронте)
      new Date().toISOString().split('T')[0],
      'draft',
      isCompatible ? 1 : 0
    ],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
// Обновить сборку ПК
app.put('/pcbuilds/:id', authenticateToken, (req, res) => {
  const { name, description, components, totalPrice, markup, markupType, isCompatible } = req.body;
  db.run(
    'UPDATE pc_builds SET name=?, description=?, components=?, totalPrice=?, markup=?, markupType=?, isCompatible=? WHERE id=?',
    [
      name,
      description || '',
      JSON.stringify(components),
      totalPrice,
      markup,
      markupType,
      isCompatible ? 1 : 0,
      req.params.id
    ],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
// Удалить сборку ПК
app.delete('/pcbuilds/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM pc_builds WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// CUSTOMERS CRUD
// Получить всех клиентов
app.get('/customers', (req, res) => {
  db.all('SELECT * FROM customers', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Получить клиента по id
app.get('/customers/:id', (req, res) => {
  db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Customer not found' });
    res.json(row);
  });
});
// Создать клиента
app.post('/customers', authenticateToken, (req, res) => {
  const { name, phone, email, city } = req.body;
  db.run(
    'INSERT INTO customers (name, phone, email, city, totalOrders, totalSpent, lastOrder, status, registered) VALUES (?, ?, ?, ?, 0, 0, NULL, NULL, ?)',
    [name, phone, email || '', city || '', new Date().toISOString().split('T')[0]],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
// Обновить клиента
app.put('/customers/:id', authenticateToken, (req, res) => {
  const { name, phone, email, city } = req.body;
  db.run(
    'UPDATE customers SET name=?, phone=?, email=?, city=? WHERE id=?',
    [name, phone, email || '', city || '', req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
// Удалить клиента
app.delete('/customers/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM customers WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// CUSTOMERS: поиск по имени, телефону, email
app.get('/customers/search', (req, res) => {
  const { name, phone, email } = req.query;
  let query = 'SELECT * FROM customers WHERE 1=1';
  let params = [];
  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (phone) {
    query += ' AND phone LIKE ?';
    params.push(`%${phone}%`);
  }
  if (email) {
    query += ' AND email LIKE ?';
    params.push(`%${email}%`);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ORDERS CRUD
// Получить все заказы
app.get('/orders', (req, res) => {
  db.all('SELECT * FROM orders', (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    // Получаем товары для каждого заказа
    const getItems = orders.map(order => new Promise((resolve, reject) => {
      db.all('SELECT id, productId, name, price, quantity FROM order_items WHERE orderId = ?', [order.id], (err, items) => {
        if (err) reject(err);
        else resolve({ ...order, items });
      });
    }));
    Promise.all(getItems)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
});
// Получить заказ по id
app.get('/orders/:id', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    db.all('SELECT id, productId, name, price, quantity FROM order_items WHERE orderId = ?', [order.id], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      order.items = items;
      res.json(order);
    });
  });
});
// Создать заказ
app.post('/orders', authenticateToken, (req, res) => {
  const { customer, phone, city, manager, items, total, notes } = req.body;
  const id = '#ORD-' + Math.floor(Math.random() * 900 + 100) + '-' + Date.now();
  db.run(
    'INSERT INTO orders (id, customer, phone, city, total, status, date, items, manager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, customer, phone, city, total, 'Принят', new Date().toISOString().split('T')[0], items.length, manager],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      // Вставляем товары заказа
      const stmt = db.prepare('INSERT INTO order_items (orderId, productId, name, price, quantity) VALUES (?, ?, ?, ?, ?)');
      for (const item of items) {
        stmt.run(id, item.id, item.name, item.price, item.quantity);
      }
      stmt.finalize();
      res.json({ id });
    }
  );
});
// Обновить заказ (только статус и менеджер)
app.put('/orders/:id', authenticateToken, (req, res) => {
  const { status, manager } = req.body;
  db.run(
    'UPDATE orders SET status=?, manager=? WHERE id=?',
    [status, manager, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
// Удалить заказ и его товары
app.delete('/orders/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM orders WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run('DELETE FROM order_items WHERE orderId=?', [req.params.id], function(err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ deleted: this.changes });
    });
  });
});

// ORDERS: поиск по клиенту, телефону, статусу
app.get('/orders/search', (req, res) => {
  const { customer, phone, status } = req.query;
  let query = 'SELECT * FROM orders WHERE 1=1';
  let params = [];
  if (customer) {
    query += ' AND customer LIKE ?';
    params.push(`%${customer}%`);
  }
  if (phone) {
    query += ' AND phone LIKE ?';
    params.push(`%${phone}%`);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  db.all(query, params, (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
});

// SUPPLIERS CRUD
// Получить всех поставщиков
app.get('/suppliers', (req, res) => {
  db.all('SELECT * FROM suppliers', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Получить поставщика по id
app.get('/suppliers/:id', (req, res) => {
  db.get('SELECT * FROM suppliers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Supplier not found' });
    res.json(row);
  });
});
// Создать поставщика
app.post('/suppliers', authenticateToken, (req, res) => {
  const { name, contact, phone, email, address, rating, deliveryTime, paymentTerms, status } = req.body;
  db.run(
    'INSERT INTO suppliers (name, contact, phone, email, address, rating, deliveryTime, paymentTerms, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, contact, phone, email, address, rating, deliveryTime, paymentTerms, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
// Обновить поставщика
app.put('/suppliers/:id', authenticateToken, (req, res) => {
  const { name, contact, phone, email, address, rating, deliveryTime, paymentTerms, status } = req.body;
  db.run(
    'UPDATE suppliers SET name=?, contact=?, phone=?, email=?, address=?, rating=?, deliveryTime=?, paymentTerms=?, status=? WHERE id=?',
    [name, contact, phone, email, address, rating, deliveryTime, paymentTerms, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
// Удалить поставщика
app.delete('/suppliers/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM suppliers WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// INVENTORY CRUD
// Получить все позиции склада
app.get('/inventory', (req, res) => {
  db.all('SELECT * FROM inventory', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Получить позицию склада по id
app.get('/inventory/:id', (req, res) => {
  db.get('SELECT * FROM inventory WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(row);
  });
});
// Создать позицию склада
app.post('/inventory', authenticateToken, (req, res) => {
  const { name, category, stock, minStock, price, supplier } = req.body;
  db.run(
    'INSERT INTO inventory (name, category, stock, minStock, price, supplier) VALUES (?, ?, ?, ?, ?, ?)',
    [name, category, stock, minStock, price, supplier],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});
// Обновить позицию склада
app.put('/inventory/:id', authenticateToken, (req, res) => {
  const { name, category, stock, minStock, price, supplier } = req.body;
  db.run(
    'UPDATE inventory SET name=?, category=?, stock=?, minStock=?, price=?, supplier=? WHERE id=?',
    [name, category, stock, minStock, price, supplier, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});
// Удалить позицию склада
app.delete('/inventory/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM inventory WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// DASHBOARD/ANALYTICS STATISTICS
app.get('/stats/summary', authenticateToken, (req, res) => {
  // Получаем общую сумму продаж, количество заказов, клиентов, средний чек, топ-5 товаров
  db.serialize(() => {
    let stats = {};
    db.get('SELECT SUM(total) as totalSales, COUNT(*) as orderCount FROM orders', (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.totalSales = row.totalSales || 0;
      stats.orderCount = row.orderCount || 0;
      db.get('SELECT COUNT(*) as customerCount FROM customers', (err2, row2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        stats.customerCount = row2.customerCount || 0;
        db.get('SELECT AVG(total) as avgOrder FROM orders', (err3, row3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          stats.avgOrder = row3.avgOrder || 0;
          db.all('SELECT name, SUM(quantity) as sold FROM order_items GROUP BY name ORDER BY sold DESC LIMIT 5', (err4, rows4) => {
            if (err4) return res.status(500).json({ error: err4.message });
            stats.topProducts = rows4;
            res.json(stats);
          });
        });
      });
    });
  });
});

// REPORTS: выгрузка заказов за период
app.get('/reports/orders', authenticateToken, (req, res) => {
  const { from, to } = req.query;
  let query = 'SELECT * FROM orders';
  let params = [];
  if (from && to) {
    query += ' WHERE date >= ? AND date <= ?';
    params = [from, to];
  } else if (from) {
    query += ' WHERE date >= ?';
    params = [from];
  } else if (to) {
    query += ' WHERE date <= ?';
    params = [to];
  }
  db.all(query, params, (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
}); 