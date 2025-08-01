import express from 'express';
import { getDb, initDb } from '../db/sqlite.js';
const router = express.Router();

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
