import { calculateFraudScore } from './fraudService';

describe('calculateFraudScore', () => {
  it('should add 0.4 for amount > 1000', () => {
    const { score, reasons } = calculateFraudScore('user@example.com', 1500);
    expect(score).toBeGreaterThanOrEqual(0.4);
    expect(reasons).toContain('Amount greater than 1000');
  });

  it('should add 0.4 for suspicious .ru domain', () => {
    const { score, reasons } = calculateFraudScore('user@site.ru', 100);
    expect(score).toBeGreaterThanOrEqual(0.4);
    expect(reasons).toContain('Suspicious email domain');
  });

  it('should add 0.4 for suspicious .test.com domain', () => {
    const { score, reasons } = calculateFraudScore('user@site.test.com', 100);
    expect(score).toBeGreaterThanOrEqual(0.4);
    expect(reasons).toContain('Suspicious email domain');
  });

  it('should add 0.2 for domain with numbers', () => {
    const { score, reasons } = calculateFraudScore('user@1234.com', 100);
    expect(score).toBeGreaterThanOrEqual(0.2);
    expect(reasons).toContain('Email domain looks suspicious');
  });

  it('should add 0.2 for .xyz domain', () => {
    const { score, reasons } = calculateFraudScore('user@site.xyz', 100);
    expect(score).toBeGreaterThanOrEqual(0.2);
    expect(reasons).toContain('Email domain looks suspicious');
  });

  it('should add 0.2 for short domain', () => {
    const { score, reasons } = calculateFraudScore('user@a.co', 100);
    expect(score).toBeGreaterThanOrEqual(0.2);
    expect(reasons).toContain('Email domain looks suspicious');
  });

  it('should clamp score to 1.0', () => {
    // This input triggers all heuristics, so score would exceed 1.0 without clamping
    const { score } = calculateFraudScore('user@site.ru', 2000);
    expect(score).toBeLessThanOrEqual(1.0);
  });

  it('should always add a random base score between 0 and 0.3', () => {
    const { reasons } = calculateFraudScore('user@example.com', 100);
    const randomReason = reasons.find(r => r.startsWith('Random base score:'));
    expect(randomReason).toBeDefined();
    const value = parseFloat(randomReason!.split(': ')[1]);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(0.3);
  });

  it('should combine multiple reasons', () => {
    const { reasons } = calculateFraudScore('user@site.ru', 2000);
    expect(reasons).toContain('Amount greater than 1000');
    expect(reasons).toContain('Suspicious email domain');
    expect(reasons.some(r => r.startsWith('Random base score:'))).toBe(true);
  });
}); 