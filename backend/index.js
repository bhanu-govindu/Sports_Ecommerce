import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import db from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

db.getConnection((err, connection) => {
  if (err) console.error('MySQL connection error:', err.message);
  else { console.log('✅ Connected to MySQL'); connection.release(); }
});

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('SportNova backend is running');
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
