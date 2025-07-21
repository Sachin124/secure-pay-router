// src/services/fraudRules/HighAmountRule.ts
import { FraudRule } from './FraudRule';
import { paymentConfig } from '../../config/paymentConfig';

export class HighAmountRule implements FraudRule {
  apply(email: string, amount: number) {
    const { threshold, score, reason } = paymentConfig.fraudRules.highAmount;
    if (amount > threshold) {
      return { score, reason };
    }
    return { score: 0 };
  }
} 