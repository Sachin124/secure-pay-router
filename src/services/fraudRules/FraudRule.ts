// src/services/fraudRules/FraudRule.ts
export interface FraudRule {
  apply(email: string, amount: number): { score: number, reason?: string };
} 