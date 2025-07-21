// src/config/paymentConfig.ts
import { paymentConfigData } from '../data/paymentConfigData';

// Simulate an async API call to fetch config
export async function fetchPaymentConfig() {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 100));
  return paymentConfigData;
}

// For backward compatibility, export the config synchronously as well (for legacy code)
export const paymentConfig = paymentConfigData; 