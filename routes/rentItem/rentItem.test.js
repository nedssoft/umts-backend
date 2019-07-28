import request from 'supertest';
import server from '../../api/server';
import { async } from '../../../../../Library/Caches/typescript/3.5/node_modules/rxjs/internal/scheduler/async';

const itemData = {
  name: 'tes',
  description: 'test description',
  price: 10,
  address: 'test address',
  imageUrl: 'https://robohash.org/quosenimdolorem.jpg?size=50x50&set=set1',
};
const userData = {
  email: 'authUser@test.com',
  password: 'test12',
  firstName: 'test',
  lastName: 'test',
};
let authToken = null;
const BaseUrl = '/api/rentItems';

beforeAll(async () => {
  await request(server)
    .post('/api/auth/register')
    .send(userData);
  const { body } = await request(server)
    .post('/api/auth/login')
    .send(userData);
  authToken = body.token;
});

describe('RentItem Endpoints', () => {
  it('should get the list of rent items', async () => {
    const { statusCode, body } = await request(server).get(BaseUrl);
    expect(statusCode).toEqual(200);
    expect(body).toHaveProperty('message', 'success');
    expect(body).toHaveProperty('rentItems', []);
  });
  it('should response with status code 401 if user is not logged in', async () => {
    const { statusCode } = await request(server)
      .post(BaseUrl)
      .send({});
    expect(statusCode).toEqual(403);
  });
  it('should fail if validation fails', async () => {
    const { statusCode, body } = await request(server)
      .post(BaseUrl)
      .set('Authorization', authToken)
      .send({});
    expect(statusCode).toEqual(422);
    expect(body).toHaveProperty('errors');
  });
  it('should create a new rent item if validation passess', async () => {
    const { statusCode, body } = await request(server)
      .post(BaseUrl)
      .set('Authorization', authToken)
      .send(itemData);
    expect(statusCode).toEqual(201);
    expect(body).toHaveProperty('item');
  });
});