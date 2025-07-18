// src/data/transactionsStore.ts
import { Transaction } from '../models/Transaction';

export const transactions: Transaction[] = [];
 
export function logTransaction(metadata: Transaction) {
  transactions.push(metadata);
} 