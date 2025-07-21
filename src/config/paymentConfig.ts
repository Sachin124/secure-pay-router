// src/config/paymentConfig.ts
import { paymentConfigData } from '../data/paymentConfigData';

// Simulate an async API call to fetch config, with a chance of failure
export async function fetchPaymentConfig() {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 50));
  // Simulate failure 10% of the time
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch config from API');
  }
  return paymentConfigData;
}

// For backward compatibility, export the config synchronously as well (for legacy code)
export const paymentConfig = paymentConfigData; 