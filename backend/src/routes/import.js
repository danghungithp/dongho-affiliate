import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { getDb } from '../db/sqlite.js';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /products/import

// Basic auth middleware
function basicAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) return res.status(401).json({ error: 'Unauthorized' });
  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  if (user !== 'admin' || pass !== 'Danghungit@85') return res.status(401).json({ error: 'Unauthorized' });
  next();
}


// Accept Excel or JSON array for import
router.post('/', basicAuth, upload.single('file'), async (req, res) => {
  let rows = [];
  if (req.file) {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet);
  } else if (Array.isArray(req.body) || typeof req.body === 'object') {
    rows = Array.isArray(req.body) ? req.body : [req.body];
  } else {
    return res.status(400).json({ error: 'No file or data uploaded' });
  }
  const db = await getDb();
  let imported = 0, skipped = 0, errors = [];
  for (const row of rows) {
    // Validation: require name, price, imageUrl
    if (!row.name || !row.price || !row.imageUrl) {
      skipped++;
      continue;
    }
    try {
      await db.run(
        `INSERT INTO products (name, brand, price, imageUrl, rating, style, isHotDeal, isNew, isBestSeller)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        row.name,
        row.brand || '',
        row.price,
        row.imageUrl,
        row.rating || 0,
        row.style || '',
        row.isHotDeal ? 1 : 0,
        row.isNew ? 1 : 0,
        row.isBestSeller ? 1 : 0
      );
      imported++;
    } catch (e) {
      errors.push({ row, error: e.message });
      skipped++;
    }
  }
  res.json({ imported, skipped, errors });
});

export default router;
