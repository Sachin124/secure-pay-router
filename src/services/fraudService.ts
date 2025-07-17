// src/services/fraudService.ts

export function calculateFraudScore(email: string, amount: number): { score: number, reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Heuristic 1: High amount
  if (amount > 1000) {
    score += 0.4;
    reasons.push('Amount greater than 1000');
  }

  // Heuristic 2: Suspicious email domain
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const suspiciousDomains = ['.ru', '.test.com'];
  if (suspiciousDomains.some(suffix => domain.endsWith(suffix))) {
    score += 0.4;
    reasons.push('Suspicious email domain');
  }
  // Simple pattern: domain looks suspicious (e.g., contains numbers or odd TLD)
  if (/\d/.test(domain) || domain.endsWith('.xyz') || domain.length < 5) {
    score += 0.2;
    reasons.push('Email domain looks suspicious');
  }

  // Heuristic 3: Random base score
  const randomBase = Math.random() * 0.3;
  score += randomBase;
  reasons.push(`Random base score: ${randomBase.toFixed(2)}`);

  // Clamp score to 1.0 max
  score = Math.min(score, 1.0);

  return { score, reasons };
} 