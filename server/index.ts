import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { initializeFirebaseAdmin } from './services/firebaseAdmin';
import settingsRouter from './routes/settings';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import paymentsRouter from './routes/payments';
import affiliateRouter from './routes/affiliate';
import usersRouter from './routes/users';
import merchantsRouter from './routes/merchants';
import couponsRouter from './routes/coupons';

const app = express();
const port = process.env.PORT || 3001;

initializeFirebaseAdmin();

app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts.' },
});

app.use(globalLimiter);

app.use('/api/settings', settingsRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/affiliate', affiliateRouter);
app.use('/api/users', usersRouter);
app.use('/api/merchants', merchantsRouter);
app.use('/api/coupons', couponsRouter);

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  platform: 'Munjum API',
}));

app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

app.listen(port, () => {
  console.log(`🚀 Munjum API running on http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/api/health`);
});

export default app;
