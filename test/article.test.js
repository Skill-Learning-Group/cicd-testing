const request = require("supertest");
const app = require("../server/config/express");
const config = require("../server/config/config");
let token;
let recordId = null;
const mongoose = require('mongoose');
describe("Test the article paths", () => {

  beforeAll(async () => {
    const connectToDB = async () => new Promise((resolve, reject) => {
      mongoose.Promise = Promise;
      const mongoUri = config.mongo.host;
      mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
      mongoose.connection.on('connected', () => {
        console.info(`connected to database: ${mongoUri}`);
        resolve();
      });
      mongoose.connection.on('error', () => {
        throw new Error(`unable to connect to database: ${mongoUri}`);
      });
    });
    await connectToDB();
    const response = await request(app).post("/login").send({
      username: 'j.y',
      password: 'pass123'
    });
    token = response.body.data.token;
  });

  test("It should response the CREATE method", async done => {
    const response = await request(app).post("/articles").send({
      title: 'article 1',
      content: 'article content',
      writer: 'J.Y',
      token
    });
    expect(response.statusCode).toBe(201);
    recordId = response.body.data._id;
    done();
  });

  test("It should response the LIST method", async done => {
    const response = await request(app).get("/articles").send({ token });
    expect(response.statusCode).toBe(200);
    done();
  });

  test("It should response the READ method", async done => {
    const response = await request(app).get(`/articles/${recordId}`).send({ token });
    expect(response.statusCode).toBe(200);
    done();
  });

  test("It should response the UPDATE method", async done => {
    const response = await request(app).put(`/articles/${recordId}`).send({ token, content: 'update content' });
    expect(response.statusCode).toBe(200);
    done();
  });

  test("It should response the DELETE method", async done => {
    const response = await request(app).delete(`/articles/${recordId}`).send({ token });
    expect(response.statusCode).toBe(200);
    done();
  });
  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });
});