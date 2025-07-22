// src/services/fraudService.ts
import { paymentConfig } from '../config/paymentConfig';
import crypto from 'crypto';
export function calculateFraudScore(email: string, amount: number): { score: number, reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Heuristic 1: High amount
  const { threshold: highAmountThreshold, score: highAmountScore, reason: highAmountReason } = paymentConfig.fraudRules.highAmount;
  if (amount > highAmountThreshold) {
    score += highAmountScore;
    reasons.push(highAmountReason);
  }

  // Heuristic 2: Suspicious email domain
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const { score: suspiciousDomainScore, reason: suspiciousDomainReason } = paymentConfig.fraudRules.suspiciousDomain;
  if (paymentConfig.suspiciousEmailDomains.some(suffix => domain.endsWith(suffix))) {
    score += suspiciousDomainScore;
    reasons.push(suspiciousDomainReason);
  }
  // Simple pattern: domain looks suspicious (e.g., contains numbers or odd TLD)
  const { score: patternDomainScore, reason: patternDomainReason } = paymentConfig.fraudRules.patternDomain;
  if (/\d/.test(domain) || domain.endsWith('.xyz') || domain.length < 5) {
    score += patternDomainScore;
    reasons.push(patternDomainReason);
  }

  // Heuristic 3: Random base score
  const { max: randomBaseScoreMax, reason: randomBaseReason } = paymentConfig.fraudRules.randomBase;
  const randomBase = seededRandom(email, amount) * randomBaseScoreMax;
  score += randomBase;
  reasons.push(`${randomBaseReason}: ${randomBase.toFixed(2)}`);

  // Clamp score to 1.0 max
  score = Math.min(score, 1.0);

  return { score, reasons };
}

function seededRandom(email:string, amount:number): number {
  const hash = crypto.createHash('md5').update(`${email}${amount}`).digest('hex');
  const seed = parseInt(hash.slice(0, 8), 16);
  return (seed % 1000) / 1000; // Normalize to [0, 1] it mean returns floats between 0 and 1
}