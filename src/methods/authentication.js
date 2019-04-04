'use strict';

const { HttpError } = require('relieve-common');
const Config = require('../config/jwt');
const GAuth = require('../utils/libs/gauth');

const Repository = require('../repositories');
const { create, googleCallback } = require('../utils/transformers/user_transformer');
const { REDIRECT_ACTIONS } = require('../utils/constant');
const AddressAdapter = require('../utils/adapters/address');

exports.register = async (data, context) => {
    try {
        const Repo = new Repository();

        let user = await Repo.get('user').findOne({ email: data.body.email });
        if (user) throw HttpError.UnprocessableEntity('email already exsist');

        user = await Repo.get('user').findOne({ username: data.body.username });
        if (user) throw HttpError.UnprocessableEntity('username already exsist');

        const payload = create(data.body);
        const newUser = await Repo.get('user').create(payload);

        /** generate address */
        await AddressAdapter.createNewAddress(data.body.address, newUser.id);

        const { token, refresh: refreshToken } = await newUser.sign();

        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return {
            message: 'register success',
            data: response
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.login = async (data, context) => {
    try {
        const Repo = new Repository();

        const user = await Repo.get('user').findOne({ $or: [{ username: data.body.username }, { email: data.body.username }], is_complete: true });
        if (!user) throw HttpError.NotAuthorized('Credentials not match');

        const { token, refresh: refreshToken } = await user.signIn(data.body.password);
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return {
            message: 'login success',
            data: response
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.refresh = async (data, context) => {
    try {
        const Repo = new Repository();

        const user = await Repo.get('user').findOne({ 'refresh_token.token': data.body.refresh_token });
        if (!user) throw HttpError.NotAuthorized('refresh token invalid');

        const token = await user.signByRefresh();
        const response = {
            new_token: token,
            expires_in: Config.expired
        };

        return {
            message: 'token refreshed',
            data: response
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.googleCallback = async (data, context) => {
    try {
        const idToken = data.body.idToken;
        const client = GAuth.getClient();

        let ticket;
        try {
            ticket = await client.verifyIdToken({ idToken });
        } catch (err) { // eslint-disable-line
            throw HttpError.BadRequest('id token invalid');
        }

        const jwtPayload = ticket.getPayload();
        const payload = googleCallback(jwtPayload);

        const Repo = new Repository();
        let user = await Repo.get('user').findOne({ email: payload.email });


        /** if user already registered, authenticate user */
        if (!user) {
            user = await Repo.get('user').create({ email: payload.email, is_complete: false });
        }

        const redirect = user.is_complete ? REDIRECT_ACTIONS.NONE : REDIRECT_ACTIONS.COMPLETE_REGISTRATION;
        const { token, refresh: refreshToken } = await user.sign();
        return {
            message: 'callback success',
            data: {
                token,
                refresh_token: refreshToken,
                expires_in: Config.expired,
                redirect
            }
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.paramCheck = async (data, context) => {
    try {
        const Repo = new Repository();

        const { param, value } = data.body;
        const user = await Repo.get('user').findOne({ [param]: value });
        const response = {
            param, value, is_exsist: !!user
        };

        return {
            message: 'param check success',
            data: response
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
