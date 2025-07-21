// src/data/paymentConfigData.ts

export const paymentConfigData = {
  blockScoreThreshold: 0.5,
  availableGateways: ['stripe', 'paypal'],
  blockedEmails: ['blocked@example.com', 'fraud@example.com'],
  suspiciousEmailDomains: ['.ru', '.test.com'],
}; 