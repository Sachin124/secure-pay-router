import { routePayment } from './paymentRouter';

describe('routePayment', () => {
  it('should return "blocked" for score exactly 0.5', () => {
    expect(routePayment(0.5)).toBe('blocked');
  });

  it('should return "blocked" for score greater than 0.5', () => {
    expect(routePayment(0.7)).toBe('blocked');
    expect(routePayment(1)).toBe('blocked');
  });

  it('should return "stripe" or "paypal" for score less than 0.5', () => {
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(routePayment(0.1));
    }
    expect(results.has('stripe')).toBe(true);
    expect(results.has('paypal')).toBe(true);
  });

  it('should never return "blocked" for score less than 0.5', () => {
    for (let i = 0; i < 20; i++) {
      expect(['stripe', 'paypal']).toContain(routePayment(0.2));
    }
  });
}); 