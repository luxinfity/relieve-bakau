const test = require('ava');
const Promise = require('bluebird');
const sinon = require('sinon');
const { mockRes } = require('sinon-express-mock');

const HttpError = require('../../../src/utils/http_error');
const method = require('../../../src/controllers/auth_controller');
const UserModel = require('../../../src/models/user_model');
const GAuth = require('../../../src/utils/gauth');

/** mock */
const res = mockRes();
const next = (err) => { throw err; };
/** */

const loginRequest = {
    body: {
        username: 'test@test.com'
    }
};

const registerRequest = {
    body: {
        username: 'archisdi',
        password: 'archisdi',
        fullname: 'archie isdiningrat',
        email: 'archie@relieve.com',
        phone: '081241358325',
        birthdate: '1990-12-12',
        gender: 'm'
    }
};

const refreshRequest = {
    body: {
        refresh_token: 'refreshtoken'
    }
};

const googleCallbackRequest = {
    body: {
        idToken: 'idtoken'
    }
};


test.serial('LOGIN - should return tokens if login success', async (t) => {
    const findOne = t.context.sandbox.mock(UserModel).expects('findOne').resolves({ signIn: () => ({ token: 'token', refresh: 'refresh' }) });

    await method.login(loginRequest, res, next)
        .then((response) => {
            t.true(findOne.called);
        });
});

test.serial('LOGIN - should throw error if user not found', async (t) => {
    t.context.sandbox.mock(UserModel).expects('findOne').resolves(null);

    await method.login(loginRequest, res, next)
        .then((response) => {
            t.fail();
        })
        .catch((err) => {
            t.is(err.status, 401);
            t.is(err.message, 'Not Authorized');
        });
});

test.serial('REGISTER - should save user and return tokens if success', async (t) => {
    const find = t.context.sandbox.mock(UserModel).expects('findOne').resolves(null).atLeast(1);
    const create = t.context.sandbox.mock(UserModel).expects('create').resolves({ sign: () => ({ token: 'token', refresh: 'refresh' }) });

    await method.register(registerRequest, res, next)
        .then((response) => {
            t.true(find.called);
            t.true(create.called);
            t.pass();
        });
});

test.serial('REGISTER - should throw error if email already exsist', async (t) => {
    t.context.sandbox.mock(UserModel).expects('findOne').withArgs({ email: registerRequest.body.email }).resolves({ name: 'archie' });

    await method.register(registerRequest, res, next)
        .then((response) => {
            t.fail('should throw error');
        })
        .catch((err) => {
            t.is(err.status, 422);
            t.is(err.user_message, 'email already exsist');
        });
});

test.serial('REGISTER - should throw error if username already exsist', async (t) => {
    const stub = t.context.sandbox.stub(UserModel, 'findOne');
    stub.withArgs({ email: registerRequest.body.email }).resolves(null);
    stub.withArgs({ username: registerRequest.body.username }).resolves({ name: 'archie' });

    await method.register(registerRequest, res, next)
        .then((response) => {
            t.fail('should throw error');
        })
        .catch((err) => {
            t.is(err.status, 422);
            t.is(err.user_message, 'username already exsist');
        });
});

test.serial('REFRESH TOKEN - should renew token from refresh token', async (t) => {
    const find = t.context.sandbox.mock(UserModel).expects('findOne').resolves({ name: 'archie', signByRefresh: () => ({ token: 'newtoken' }) });

    await method.refresh(refreshRequest, res, next)
        .then((response) => {
            t.true(find.called);
            t.pass();
        });
});

test.serial('REFRESH TOKEN - should throw error if refresh token invalis', async (t) => {
    t.context.sandbox.mock(UserModel).expects('findOne').resolves(null);

    await method.refresh(refreshRequest, res, next)
        .then((response) => {
            t.fail('should throw error');
        })
        .catch((err) => {
            t.is(err.status, 401);
            t.is(err.message, 'Not Authorized');
        });
});

test.serial('GOOGLE CALLBACK - should create new user if none found', async (t) => {
    t.context.sandbox.mock(UserModel).expects('findOne').resolves(null);
    t.context.sandbox.mock(UserModel).expects('create').resolves({ sign: () => ({ token: 'token', refresh: 'refresh' }) });
    t.context.sandbox.mock(GAuth).expects('getClient').returns({
        verifyIdToken: () => Promise.resolve({
            getPayload: () => ({
                email: 'user@relieve.com',
                name: 'relieve'
            })
        })
    });

    await method.googleCallback(googleCallbackRequest, res, next)
        .then((response) => {
            t.pass();
        });
});

test.serial('GOOGLE CALLBACK - should log user in if found', async (t) => {
    t.context.sandbox.mock(UserModel).expects('findOne').resolves({ sign: () => ({ token: 'token', refresh: 'refresh' }) });
    t.context.sandbox.mock(GAuth).expects('getClient').returns({
        verifyIdToken: () => Promise.resolve({
            getPayload: () => ({
                email: 'user@relieve.com',
                name: 'relieve'
            })
        })
    });

    await method.googleCallback(googleCallbackRequest, res, next)
        .then((response) => {
            t.pass();
        });
});

test.serial('GOOGLE CALLBACK - should throw error if id token invalid', async (t) => {
    t.context.sandbox.mock(UserModel).expects('findOne').resolves({ sign: () => ({ token: 'token', refresh: 'refresh' }) });
    t.context.sandbox.mock(GAuth).expects('getClient').returns({
        verifyIdToken: () => Promise.rejects()
    });

    await method.googleCallback(googleCallbackRequest, res, next)
        .then((response) => {
            t.fail('should throw error');
        })
        .catch((err) => {
            t.is(err.status, 400);
        });
});

test.before('Initialize HttpError', (t) => {
    HttpError.initialize();
});

test.beforeEach('Initialize New Sandbox Before Each Test', (t) => {
    t.context.sandbox = sinon.createSandbox().usingPromise(Promise.Promise);
});

test.afterEach.always('Restore Sandbox and Configuration After Each Test', (t) => {
    t.context.sandbox.restore();
});
