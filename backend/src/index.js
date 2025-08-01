import './db/init.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/products.js';
import affiliateRoutes from './routes/affiliate.js';
import importRoutes from './routes/import.js';
import uploadRoutes from './routes/upload.js';

// Load env
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/upload-image', uploadRoutes);
// API routes
app.use('/products', productRoutes);
app.use('/affiliate', affiliateRoutes);
app.use('/products/import', importRoutes);

// Health check
app.get('/', (req, res) => res.send('Dongho Affiliate API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
