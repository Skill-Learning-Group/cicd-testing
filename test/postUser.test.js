const request = require('supertest');
const config = require('../server/config/config');
const app = require('../server/config/express');
const User = require('../server/models/user.model');
const mongoose = require('mongoose');

describe('test create user', () => {
  let token;
  const deleteUsers = [];
  beforeAll(async () => {
    const mongoUri = config.mongo.host;
    mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

    await new Promise((resolve, reject) => {
      mongoose.connection.on('connected', () => {
        console.log(`connected to database: ${mongoUri}`);
        resolve();
      });

      mongoose.connection.on('error', () => {
        console.loog(`unable to connect to database: ${mongoUri}`);
        reject();
      });
    })


    const loginResponse = await request(app).post('/login').send({ username: 'chung', password: 'pass123' });
    const { data } = loginResponse.body;
    token = data.token;
  });

  afterAll(async () => {
    await User.deleteMany({ id: deleteUsers });
    await User.deleteMany({ username: 'test' });
    mongoose.connection.close();
  });

  test('should fail create user: missing username & password', async done => {
    const response = await request(app).post('/users').send({ token });
    const { message } = response.body;
    const status = response.status;
    expect(status).toBe(400);
    expect(message).toBe('token or username or password can not be empty!');
    done();
  });

  test('should fail create user: missing username', async done => {
    const response = await request(app).post('/users').send({ token, username: 'test' });
    const { message } = response.body;
    const status = response.status;
    expect(status).toBe(400);
    expect(message).toBe('token or username or password can not be empty!');
    done();
  });

  test('should fail create user: missing password', async done => {
    const response = await request(app).post('/users').send({ token, password: 'pass123' });
    const { message } = response.body;
    const status = response.status;
    expect(status).toBe(400);
    expect(message).toBe('token or username or password can not be empty!');
    done();
  });

  test('should success create user [test]', async done => {
    const response = await request(app).post('/users').send({ token, username: 'test', password: 'pass123' });
    const { success, status, data } = response.body;
    const statusCode = response.status;

    const { _id, username, password } = data;
    expect(success).not.toBeFalsy();
    expect(status).toBe(201);
    expect(statusCode).toBe(201);
    expect(username).toBe('test')
    expect(password).toBe('pass123');
    expect(data).toHaveProperty('_id');
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');
    deleteUsers.push(_id);
    done();
  });

});