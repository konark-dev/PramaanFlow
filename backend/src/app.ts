import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { router as apiRouter } from './routes';

export const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// Guarantee database seeding finishes before handling any requests
app.use(async (_req, _res, next) => {
  try {
    const { ensureSeeded } = await import('./lib/memoryDb');
    await ensureSeeded();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', apiRouter);

// Keep the error handler mounted last.
app.use(errorHandler);

export default app;
