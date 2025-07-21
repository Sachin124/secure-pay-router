import { routePayment } from './paymentRouter';
import { paymentConfigData } from '../data/paymentConfigData';

describe('routePayment', () => {
  it(`should return "blocked" for score exactly blockScoreThreshold (${paymentConfigData.blockScoreThreshold})`, async () => {
    await expect(routePayment(paymentConfigData.blockScoreThreshold)).resolves.toBe(paymentConfigData.status.blocked);
  });

  it('should return "blocked" for score greater than blockScoreThreshold', async () => {
    await expect(routePayment(paymentConfigData.blockScoreThreshold + 0.2)).resolves.toBe(paymentConfigData.status.blocked);
    await expect(routePayment(1)).resolves.toBe(paymentConfigData.status.blocked);
  });

  it('should return a valid gateway for score less than blockScoreThreshold', async () => {
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(await routePayment(paymentConfigData.blockScoreThreshold - 0.1));
    }
    paymentConfigData.availableGateways.forEach(gateway => {
      expect(results.has(gateway)).toBe(true);
    });
  });

  it('should never return "blocked" for score less than blockScoreThreshold', async () => {
    for (let i = 0; i < 20; i++) {
      const result = await routePayment(paymentConfigData.blockScoreThreshold - 0.2);
      expect(paymentConfigData.availableGateways).toContain(result);
    }
  });
}); 