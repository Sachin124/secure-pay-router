import { Router } from 'express';
import { chargeController, getTransactions } from '../controllers/chargeController';
import { validateCharge } from '../middlewares/validateCharge';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/charge', rateLimiter, validateCharge, chargeController);
router.get('/transactions', getTransactions);

export default router; 