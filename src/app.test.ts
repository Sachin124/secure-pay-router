import request from 'supertest';
import app from './app';

jest.mock('./services/llmService', () => ({
  generateExplanation: async () => 'Mocked explanation.'
}));

describe('POST /charge', () => {
  it('returns 200 and transaction object for valid input', async () => {
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 100,
        currency: 'USD',
        source: 'tok_visa',
        email: 'test@example.com'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).toHaveProperty('amount', 100);
    expect(res.body).toHaveProperty('currency', 'USD');
    expect(res.body).toHaveProperty('explanation', 'Mocked explanation.');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('riskScore');
    expect(res.body).toHaveProperty('provider');
    expect(res.body).toHaveProperty('status');
  });

  it('returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/charge')
      .send({ amount: 100, currency: 'USD', source: 'tok_visa' }); // missing email
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid types', async () => {
    const res = await request(app)
      .post('/charge')
      .send({ amount: 'not-a-number', currency: 123, source: {}, email: 'bademail' });
    expect(res.status).toBe(400);
  });

  it('returns blocked for high-risk input', async () => {
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 2000,
        currency: 'USD',
        source: 'tok_visa',
        email: 'user@site.ru'
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('blocked');
    expect(res.body.provider).toBeNull();
  });

  it('returns allowed for low-risk input', async () => {
    const res = await request(app)
      .post('/charge')
      .send({
        amount: 10,
        currency: 'USD',
        source: 'tok_visa',
        email: 'user@example.com'
      });
    expect(res.status).toBe(200);
    expect(['stripe', 'paypal']).toContain(res.body.provider);
    expect(res.body.status).toBe('success');
  });
}); 