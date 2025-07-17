// src/models/Transaction.ts

export interface Transaction {
  timestamp: string;
  email: string;
  amount: number;
  currency: string;
  riskScore: number;
  provider: string | null;
  status: string;
  explanation: string;
  source: string;
} 