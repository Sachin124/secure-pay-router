import { routePayment } from './paymentRouter';

describe('routePayment', () => {
  it('should return "blocked" for score exactly 0.5', async () => {
    await expect(routePayment(0.5)).resolves.toBe('blocked');
  });

  it('should return "blocked" for score greater than 0.5', async () => {
    await expect(routePayment(0.7)).resolves.toBe('blocked');
    await expect(routePayment(1)).resolves.toBe('blocked');
  });

  it('should return "stripe" or "paypal" for score less than 0.5', async () => {
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(await routePayment(0.1));
    }
    expect(results.has('stripe')).toBe(true);
    expect(results.has('paypal')).toBe(true);
  });

  it('should never return "blocked" for score less than 0.5', async () => {
    for (let i = 0; i < 20; i++) {
      await expect(routePayment(0.2)).resolves.toMatch(/stripe|paypal/);
    }
  });
}); 