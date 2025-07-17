import { Router } from 'express';
import { chargeController, getTransactions } from '../controllers/chargeController';
import { validateCharge } from '../middlewares/validateCharge';

const router = Router();

router.post('/charge', validateCharge, chargeController);
router.get('/transactions', getTransactions);

export default router; 