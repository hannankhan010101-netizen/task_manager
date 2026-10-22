process.env.NODE_ENV = 'test';
process.env.CLIENT_URL = 'http://localhost:3000';

const request = require('supertest');
const createApp = require('../app');
const { connect, closeDatabase, clearDatabase } = require('./setup');

const app = createApp();

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Task CRUD routes', () => {
  test('GET /api/tasks returns an empty list initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Buy milk', description: 'From the shop' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Buy milk');
    expect(res.body.completed).toBe(false);
    expect(res.body._id).toBeDefined();
  });

  test('POST /api/tasks with no title responds 400', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('GET /api/tasks returns tasks newest first', async () => {
    const first = await request(app).post('/api/tasks').send({ title: 'First task' });
    const second = await request(app).post('/api/tasks').send({ title: 'Second task' });

    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]._id).toBe(second.body._id);
    expect(res.body[1]._id).toBe(first.body._id);
  });

  test('PATCH /api/tasks/:id updates a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Original' });

    const res = await request(app)
      .patch(`/api/tasks/${created.body._id}`)
      .send({ title: 'Updated', completed: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.completed).toBe(true);
  });

  test('PATCH /api/tasks/:id with invalid id responds 400', async () => {
    const res = await request(app).patch('/api/tasks/not-an-id').send({ title: 'Nope' });
    expect(res.status).toBe(400);
  });

  test('PATCH /api/tasks/:id with valid but missing id responds 404', async () => {
    const res = await request(app)
      .patch('/api/tasks/507f1f77bcf86cd799439011')
      .send({ title: 'Nope' });
    expect(res.status).toBe(404);
  });

  test('DELETE /api/tasks/:id removes a task and responds 204', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'To delete' });

    const res = await request(app).delete(`/api/tasks/${created.body._id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});

    const getRes = await request(app).get('/api/tasks');
    expect(getRes.body).toHaveLength(0);
  });

  test('DELETE /api/tasks/:id with invalid id responds 400', async () => {
    const res = await request(app).delete('/api/tasks/not-an-id');
    expect(res.status).toBe(400);
  });

  test('DELETE /api/tasks/:id with valid but missing id responds 404', async () => {
    const res = await request(app).delete('/api/tasks/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });
});

describe('Health check', () => {
  test('GET /api/health responds ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
