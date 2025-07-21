// src/services/fraudRules/SuspiciousDomainRule.ts
import { FraudRule } from './FraudRule';
import { paymentConfig } from '../../config/paymentConfig';

export class SuspiciousDomainRule implements FraudRule {
  apply(email: string, amount: number) {
    const domain = email.split('@')[1]?.toLowerCase() || '';
    const { score, reason } = paymentConfig.fraudRules.suspiciousDomain;
    if (paymentConfig.suspiciousEmailDomains.some(suffix => domain.endsWith(suffix))) {
      return { score, reason };
    }
    return { score: 0 };
  }
} 