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
    birthdate: '1995-12-12'
};
const endpoint = '/refresh';

test.serial('successfully refresh token', async (t) => {
    const { body: { content: { refresh_token: refreshToken } } } = await request(app).post('/login')
        .set('secret', apiSecret)
        .send({ username: user.username, password: user.password });

    await request(app).post(endpoint)
        .set('secret', apiSecret)
        .send({ refresh_token: refreshToken })
        .then(({ status, body }) => {
            t.is(status, 200);
        });
});

test.serial('return 401 if refresh token expired', async (t) => {
    const { body: { content: { refresh_token: refreshToken } } } = await request(app).post('/login')
        .set('secret', apiSecret)
        .send({ username: user.username, password: user.password });

    await userModel.updateOne({ 'refresh_token.expirity_date': new Date(2000, 12, 12) });

    await request(app).post(endpoint)
        .set('secret', apiSecret)
        .send({ refresh_token: refreshToken })
        .then(({ status, body }) => {
            t.is(status, 401);
        });
});

test.before('create test credential', async (t) => {
    await userModel.create({
        ...user,
        is_complete: true
    });
});

test.after.always('delete test credential', async (t) => {
    await userModel.deleteOne({ username: user.username });
});
