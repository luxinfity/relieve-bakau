'use strict';

const { HttpError } = require('node-common');
const { HttpResponse } = require('../utils/helpers');
const Config = require('../config/jwt');
const GAuth = require('../utils/libs/gauth');

const Repository = require('../repositories');
const { create, googleCallback } = require('../utils/transformers/user_transformer');

exports.register = async (req, res, next) => {
    try {
        const Repo = new Repository();

        let user = await Repo.get('user').findOne({ email: req.body.email });
        if (user) throw HttpError.UnprocessableEntity('email already exsist');

        user = await Repo.get('user').findOne({ username: req.body.username });
        if (user) throw HttpError.UnprocessableEntity('username already exsist');

        const payload = create(req.body);
        const newUser = await Repo.get('user').create(payload);

        const { token, refresh: refreshToken } = await newUser.sign();

        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return HttpResponse(res, 'register success', response);
    } catch (err) {
        return next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const user = await Repo.get('user').findOne({ $or: [{ username: req.body.username }, { email: req.body.username }], is_complete: true });
        if (!user) throw HttpError.NotAuthorized('Credentials not match');

        const { token, refresh: refreshToken } = await user.signIn(req.body.password);
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return HttpResponse(res, 'login success', response);
    } catch (err) {
        return next(err);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const user = await Repo.get('user').findOne({ 'refresh_token.token': req.body.refresh_token });
        if (!user) throw HttpError.NotAuthorized('refresh token invalid');

        const token = await user.signByRefresh();
        const response = {
            new_token: token,
            expires_in: Config.expired
        };
        return HttpResponse(res, 'token refreshed', response);
    } catch (err) {
        return next(err);
    }
};

exports.googleCallback = async (req, res, next) => {
    try {
        const idToken = req.body.idToken;
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

        const user = await Repo.get('user').findOne({ email: payload.email });
        let action = 'login';

        /** if user already registered, authenticate user */
        if (user) {
            const { token, refresh: refreshToken } = await user.sign();
            return HttpResponse(res, `${action} success`, {
                token,
                refresh_token: refreshToken,
                expires_in: Config.expired,
                action
            });
        }

        /** if not registered, return basic info for registration */
        action = 'register';
        return HttpResponse(res, `redirect to ${action}`, {
            ...payload,
            action
        });
    } catch (err) {
        return next(err);
    }
};

exports.paramCheck = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const { param, value } = req.body;
        const user = await Repo.get('user').findOne({ [param]: value });
        const response = {
            param, value, is_exsist: !!user
        };

        return HttpResponse(res, 'param check success', response);
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
