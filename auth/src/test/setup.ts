import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

/**Augment Global */
declare global {
  namespace NodeJS {
    interface Global {
      /**Promise resolved as array of strings */
      getAuthCookie(): Promise<string[]>;
    }
  }
}

let mongo: any;

/**Runs before tests are executed */
beforeAll(async () => {
  process.env.JWT_KEY = 'testvar';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

/**Runs before each of our tests */
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

/**Runs after all tests are completed */
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

/**Added GetAuthCookie method to NodeJS global scope to return cookie if signed in */
global.getAuthCookie = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
