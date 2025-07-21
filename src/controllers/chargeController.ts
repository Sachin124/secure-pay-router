// src/controllers/chargeController.ts
import { Request, Response } from 'express';
import { calculateFraudScore } from '../services/fraudService';
import { routePayment } from '../services/paymentRouter';
import { generateExplanation } from '../services/llmService';
import { logTransaction, transactions } from '../data/transactionsStore';
import { Transaction } from '../models/Transaction';
import { paymentConfigData } from '../data/paymentConfigData';

export const chargeController = async (req: Request, res: Response) => {
  try {
    // Input is already validated by middleware
    const { amount, currency, source, email } = req.body;

    // 1. Calculate fraud score
    const { score, reasons } = calculateFraudScore(email, amount);

    // 2. Route payment or block
    const provider = await routePayment(score, email);
    if (provider === 'error_config_fetch') {
      return res.status(503).json({ error: 'Service temporarily unavailable due to configuration error. Please try again later.' });
    }
    const status = provider === paymentConfigData.status.blocked ? paymentConfigData.status.blocked : paymentConfigData.status.success;

    // 3. Generate explanation (LLM or simulated)
    const explanation = await generateExplanation(score, reasons, provider);

    // 4. Build transaction object
    const transaction: Transaction = {
      timestamp: new Date().toISOString(),
      email,
      amount,
      currency,
      source,
      riskScore: score,
      provider: provider === 'blocked' ? null : provider,
      status,
      explanation
    };

    // 5. Log transaction
    logTransaction(transaction);

    // 6. Return response
    res.status(200).json(transaction);
  } catch (err) {
    console.error('Error in chargeController:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTransactions = (_req: Request, res: Response) => {
  console.log('Fetching all transactions');
  res.status(200).json(transactions);
};
 