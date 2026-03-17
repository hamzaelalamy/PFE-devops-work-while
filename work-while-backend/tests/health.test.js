const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
  });
});

