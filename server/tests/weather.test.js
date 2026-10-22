process.env.NODE_ENV = 'test';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.OPENWEATHER_API_KEY = 'test-api-key';

const request = require('supertest');
const createApp = require('../app');

const app = createApp();

describe('GET /api/weather', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('responds 400 when city query param is missing', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns a flattened weather payload on success', async () => {
    const fakeOpenWeatherResponse = {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 15.2, feels_like: 14.1, humidity: 70 },
      weather: [{ description: 'light rain', icon: '10d' }],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => fakeOpenWeatherResponse,
    });

    const res = await request(app).get('/api/weather').query({ city: 'London' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      city: 'London',
      country: 'GB',
      temp: 15.2,
      feelsLike: 14.1,
      humidity: 70,
      description: 'light rain',
      icon: '10d',
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toContain('q=London');
  });

  test('responds 404 when OpenWeather cannot find the city', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'city not found' }),
    });

    const res = await request(app).get('/api/weather').query({ city: 'Nowhereland' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('responds 502 when OpenWeather returns an unexpected error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: 'server error' }),
    });

    const res = await request(app).get('/api/weather').query({ city: 'London' });

    expect(res.status).toBe(502);
  });
});
