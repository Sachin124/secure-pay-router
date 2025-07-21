import rateLimit from 'express-rate-limit';
import { Request } from 'express';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each user to 5 requests per windowMs
  keyGenerator: (req: Request) => {
    // Use email from body if present, else fallback to IP
    if (req.body && typeof req.body.email === 'string') {
      return req.body.email;
    }
    return req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      error: 'Too many requests from this user. Please try again after a minute.'
    });
  },
}); 