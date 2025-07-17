// src/services/paymentRouter.ts

export function routePayment(score: number): 'stripe' | 'paypal' | 'blocked' {
  if (score >= 0.5) {
    return 'blocked';
  }
  // Randomly choose between 'stripe' and 'paypal' if not blocked
  return Math.random() < 0.5 ? 'stripe' : 'paypal';
} 