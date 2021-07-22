import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../app";

declare global {
    function signin(_id?: string): string[];
  }

jest.mock('../nats-wrapper.ts'); // Tells jest to mock this file

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfj';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    jest.clearAllMocks() // clears the function calls on mock functions so we can get a fresh implementation
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = () => {
    // Build a JWT payload {id, email}
    const id = new mongoose.Types.ObjectId().toHexString();
    const payload = {
      id,
      email: 'test@test.com',
    };
   
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);
   
    // Build session Object {jwt: MY_JWT}
    const session = { jwt: token };
   
    // Turn session into JSON
    const sessionJSON = JSON.stringify(session);
   
    // Encode JSON as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
   
    // return cookie with encoded data
    return [`express:sess=${base64}`];
  };