import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

/**Augment Global */
declare global {
  namespace NodeJS {
    interface Global {
      /**Promise resolved as array of strings */
      getAuthCookie(): string[];
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
global.getAuthCookie = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: 'abcd1234',
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
