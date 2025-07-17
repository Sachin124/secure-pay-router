// src/app.ts - Main Express app entry point
import express from 'express';
import dotenv from 'dotenv';
import chargeRoutes from './routes/chargeRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/', chargeRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Hello, Secure Pay Router!');
});

export default app; 