import { Request, Response, NextFunction } from 'express';

export function validateInput(req: Request, res: Response, next: NextFunction) {
  const { amount, currency, source, email } = req.body;

  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ error: 'Amount must be a valid number.' });
  }
  if (!currency || typeof currency !== 'string') {
    return res.status(400).json({ error: 'Currency must be a non-empty string.' });
  }
  if (!source || typeof source !== 'string') {
    return res.status(400).json({ error: 'Source must be a non-empty string.' });
  }
  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Email must be a valid email address.' });
  }

  next();
} 