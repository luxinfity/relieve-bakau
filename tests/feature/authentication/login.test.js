require('dotenv').config();
const test = require('ava');
const request = require('supertest');
const app = require('../../../src/app');
const userModel = require('../../../src/models/user_model');

const apiSecret = process.env.API_SECRET;
const user = {
    fullname: 'relieve',
    email: 'user@relieve.com',
    username: 'relieve',
    password: 'admin',
    gender: 'm',
    phone: '081245934153',
    birthdate: '1995-12-12',
    is_complete: true
};
const endpoint = '/login';

test.serial('success login', async (t) => {
    await request(app).post(endpoint)
        .send({ username: user.username, password: user.password })
        .set('secret', apiSecret)
        .then(({ status, body }) => {
            t.is(status, 200);
        });
});

test.serial('return unautorized if try to login without api key', async (t) => {
    await request(app).post(endpoint)
        .send({ username: '', password: 'admin' })
        .then(({ status, body }) => {
            t.is(status, 401);
        });
});

test.serial('return unautorized if credentials not match', async (t) => {
    await request(app).post(endpoint)
        .send({ username: 'admin2', password: 'admin2' })
        .set('secret', apiSecret)
        .then(({ status, body }) => {
            t.is(status, 401);
        });
});

test.before('create test credential', async (t) => {
    await userModel.create(user);
});

test.after.always('delete test credential', async (t) => {
    await userModel.deleteOne({ username: user.username });
});
