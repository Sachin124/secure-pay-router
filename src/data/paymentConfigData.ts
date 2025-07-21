// src/data/paymentConfigData.ts

export const paymentConfigData = {
  blockScoreThreshold: 0.5,
  availableGateways: ['stripe', 'paypal'],
  blockedEmails: ['blocked@example.com', 'fraud@example.com'],
  suspiciousEmailDomains: ['.ru', '.test.com'],
  fraudRules: {
    highAmount: {
      threshold: 1000,
      score: 0.4,
      reason: 'Amount greater than 1000'
    },
    suspiciousDomain: {
      score: 0.4,
      reason: 'Suspicious email domain'
    },
    patternDomain: {
      score: 0.2,
      reason: 'Email domain looks suspicious'
    },
    randomBase: {
      max: 0.3,
      reason: 'Random base score'
    }
  },
  explanationMessages: {
    blocked: 'This payment was blocked due to a high risk score based on: {reasons}.',
    routed: 'This payment was routed to {provider} due to a low risk score based on: {reasons}.',
    allowed: 'This payment was allowed due to a low risk score based on: {reasons}.'
  },
}; 