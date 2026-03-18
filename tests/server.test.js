const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('defaults id to Stranger when not provided', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('Stranger');
  });

  it('uses provided id query param', async () => {
    const res = await request(app).get('/?id=Alice');
    expect(res.text).toContain('Alice');
  });
});
