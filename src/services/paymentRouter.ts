// src/services/paymentRouter.ts
import { fetchPaymentConfig } from '../config/paymentConfig';
import { paymentConfigData } from '../data/paymentConfigData';

export async function routePayment(score: number, email?: string): Promise<string> {
  try {
    const paymentConfig = await fetchPaymentConfig();
    // Check if the email is blocked
    if (email && paymentConfig.blockedEmails.includes(email)) {
      return paymentConfigData.status.blocked;
    }
    // Check if the score exceeds the block threshold
    if (score >= paymentConfig.blockScoreThreshold) {
      return paymentConfigData.status.blocked;
    }
    // Randomly choose from available gateways
    const gateways = paymentConfig.availableGateways;
    const randomIndex = Math.floor(Math.random() * gateways.length);
    return gateways[randomIndex];
  } catch (err) {
    console.error('Config fetch failed in routePayment:', err);
    return 'error_config_fetch';
  }
} 