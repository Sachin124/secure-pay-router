// src/app.ts - Main Express app entry point
import express from 'express';
import dotenv from 'dotenv';
import chargeRoutes from './routes/chargeRoutes';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['POST', 'GET']
}));
app.use(helmet());
app.use(errorHandler);
app.use('/', chargeRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Hello, Secure Pay Router!');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit or notify
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // Optionally exit or notify
});

export default app; 