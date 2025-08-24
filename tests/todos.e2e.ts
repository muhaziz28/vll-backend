import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

const app = createApp();

describe('Todo E2E', () => {
  beforeAll(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create, read, update and delete a todo', async () => {
    const createRes = await request(app)
      .post('/api/v1/todos')
      .send({ title: 'first task', description: 'desc' })
      .expect(201);

    const created = createRes.body as { id: string; title: string };

    const listRes = await request(app).get('/api/v1/todos').expect(200);
    expect(Array.isArray(listRes.body.items)).toBe(true);
    expect(listRes.body.items.length).toBeGreaterThanOrEqual(1);

    const getRes = await request(app).get(`/api/v1/todos/${created.id}`).expect(200);
    expect(getRes.body.id).toBe(created.id);

    const updateRes = await request(app)
      .put(`/api/v1/todos/${created.id}`)
      .send({ completed: true })
      .expect(200);
    expect(updateRes.body.completed).toBe(true);

    await request(app).delete(`/api/v1/todos/${created.id}`).expect(204);

    await request(app).get(`/api/v1/todos/${created.id}`).expect(404);
  });
});
