const request = require('supertest');
const app = require('../server/config/express');
const config = require('../server/config/config');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
let token = null;
let firstUser = null;
describe('RUN test case get user', () => {
  beforeAll(async (done) => {
    await new Promise((resolve, reject) => {
      mongoose.connection.on('connected', () => {
        console.log(`connected to database: ${mongoUri}`);
        resolve();
      });
      mongoose.connection.on('error', () => {
        console.log(`unable to connect to database: ${mongoUri}`);
        reject();
      });
    });
    done();
  }, 30000);
  test('trying to login', (done) => {
    request(app)
      .post('/login')
      .send({
        username: 'simon',
        password: 'pass123'
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        token = response.body.data.token;
        done();
      });
  });
  test('It should return 401 becoz of invalid token - /users', (done) => {
    request(app)
      .get('/users')
      .send({
        token: 'invalid_token'
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('It should return 200 becoz of valid token - /users', (done) => {
    request(app)
      .get('/users')
      .send({
        token
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        const data = response.body.data;
        firstUser = data[0];
        done();
      });
  });
  test('It should return 404 becoz of user id not found - /users/:id', (done) => {
    request(app)
      .get(`/users/5f22dd33cdefff8064c5ddda`)
      .send({
        token
      })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('It should return 404 becoz of invalid token and valid user id - /users/:id', (done) => {
    request(app)
      .get(`/users/${firstUser._id}`)
      .send({
        token: 'invalid_token'
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('It should return 200 becoz of valid token and valid user id - /users/:id', (done) => {
    request(app)
      .get(`/users/${firstUser._id}`)
      .send({
        token
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });
});