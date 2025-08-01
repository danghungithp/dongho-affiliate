import express from 'express';
import { getDb, initDb } from '../db/sqlite.js';
const router = express.Router();

// Basic auth middleware
function basicAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) return res.status(401).json({ error: 'Unauthorized' });
  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  if (user !== 'admin' || pass !== 'Danghungit@85') return res.status(401).json({ error: 'Unauthorized' });
  next();
}
// POST /products (add new)
router.post('/', basicAuth, async (req, res) => {
  const db = await getDb();
  const { name, brand, price, imageUrl, rating, style, isHotDeal, isNew, isBestSeller } = req.body;
  if (!name || !price || !imageUrl) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const result = await db.run(
      `INSERT INTO products (name, brand, price, imageUrl, rating, style, isHotDeal, isNew, isBestSeller)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      name,
      brand || '',
      price,
      imageUrl,
      rating || 0,
      style || '',
      isHotDeal ? 1 : 0,
      isNew ? 1 : 0,
      isBestSeller ? 1 : 0
    );
    res.json({ id: result.lastID });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /products/:id (edit)
router.put('/:id', basicAuth, async (req, res) => {
  const db = await getDb();
  const { name, brand, price, imageUrl, rating, style, isHotDeal, isNew, isBestSeller } = req.body;
  if (!name || !price || !imageUrl) return res.status(400).json({ error: 'Missing required fields' });
  try {
    await db.run(
      `UPDATE products SET name=?, brand=?, price=?, imageUrl=?, rating=?, style=?, isHotDeal=?, isNew=?, isBestSeller=? WHERE id=?`,
      name,
      brand || '',
      price,
      imageUrl,
      rating || 0,
      style || '',
      isHotDeal ? 1 : 0,
      isNew ? 1 : 0,
      isBestSeller ? 1 : 0,
      req.params.id
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /products/:id (delete)
router.delete('/:id', basicAuth, async (req, res) => {
  const db = await getDb();
  try {
    await db.run('DELETE FROM products WHERE id = ?', req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /products
router.get('/', async (req, res) => {
  const db = await getDb();
  const { brand, style, minPrice, maxPrice, page = 1, pageSize = 12 } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  let params = [];
  if (brand) {
    query += ' AND brand = ?';
    params.push(brand);
  }
  if (style) {
    query += ' AND style = ?';
    params.push(style);
  }
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }
  // Get total count for pagination
  const countRow = await db.get('SELECT COUNT(*) as count FROM (' + query + ')', params);
  const total = countRow.count;
  // Pagination
  query += ' LIMIT ? OFFSET ?';
  params.push(Number(pageSize));
  params.push((Number(page) - 1) * Number(pageSize));
  const products = await db.all(query, params);
  res.json({ products, total });
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  const db = await getDb();
  const product = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

export default router;
