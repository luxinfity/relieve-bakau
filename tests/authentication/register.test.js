require('dotenv').config();
const test = require('ava');
const request = require('supertest');
const app = require('../../app');
const userModel = require('../../app/models/user_model');

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
const endpoint = '/register';

test.serial('successfully register', async (t) => {
    await request(app).post(endpoint)
        .set('secret', apiSecret)
        .send({
            fullname: 'relieve2',
            email: 'user2@relieve.com',
            username: 'relieve2',
            password: 'admin',
            gender: 'm',
            phone: '081245934153',
            birthdate: '1995-12-12'
        })
        .then(({ status, body }) => {
            t.is(status, 200);
        });
    await userModel.deleteOne({ username: 'relieve2' });
});

test.serial('return 422 if email already exsist', async (t) => {
    await request(app).post(endpoint)
        .set('secret', apiSecret)
        .send({
            ...user
        })
        .then(({ status, body }) => {
            t.is(status, 422);
        });
});

test.serial('return 422 if username already exsist', async (t) => {
    await request(app).post(endpoint)
        .set('secret', apiSecret)
        .send({
            ...user,
            email: 'test@mail.com'
        })
        .then(({ status, body }) => {
            t.is(status, 422);
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
