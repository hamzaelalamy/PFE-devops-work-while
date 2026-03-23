/* eslint-env jest */
// Minimal smoke test for the health endpoint.
// We mock heavy dependencies so tests stay fast and simple.

// Mock @xenova/transformers (ESM-only) before loading the app
jest.mock('@xenova/transformers', () => ({
  pipeline: () => jest.fn(),
}));

// Mock database connection to avoid hitting a real MongoDB in CI
jest.mock('../src/config/database', () => ({
  connectDB: jest.fn(),
}));

const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint (smoke test)', () => {
  it('should return 200 and a status field', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
  });
});



