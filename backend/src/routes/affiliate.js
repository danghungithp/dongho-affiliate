import express from 'express';
import { getDb } from '../db/sqlite.js';
const router = express.Router();

// GET /affiliate/:id
router.get('/:id', async (req, res) => {
  const db = await getDb();
  const product = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  // Example: generate Shopee affiliate link (replace with real logic)
  const affiliateLink = `https://shopee.vn/product/${product.id}?aff_id=YOUR_AFFILIATE_ID`;
  res.json({ link: affiliateLink });
});

export default router;
