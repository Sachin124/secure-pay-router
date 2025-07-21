// src/services/paymentRouter.ts
import { fetchPaymentConfig } from '../config/paymentConfig';

export async function routePayment(score: number, email?: string): Promise<string> {
  const paymentConfig = await fetchPaymentConfig();
  // Check if the email is blocked
  console.log(`Routing payment for email: ${email}, score: ${score}`);
  
  if (email && paymentConfig.blockedEmails.includes(email)) {
    return 'blocked';
  }
  // Check if the score exceeds the block threshold
  if (score >= paymentConfig.blockScoreThreshold) {
    return 'blocked';
  }
  // Randomly choose from available gateways
  const gateways = paymentConfig.availableGateways;
  const randomIndex = Math.floor(Math.random() * gateways.length);
  return gateways[randomIndex];
} 