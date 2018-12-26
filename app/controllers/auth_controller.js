'use strict';

const { httpResponse } = require('../utils/helpers');
const User = require('../models/user_model');
const Config = require('../config/jwt');
const UserTransformer = require('../utils/transformers/user_transformer');
const HttpException = require('../utils/http_exception');
const GAuth = require('../utils/gauth');

exports.register = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) throw HttpException.UnprocessableEntity('email already exsist');

        user = await User.findOne({ username: req.body.username });
        if (user) throw HttpException.UnprocessableEntity('username already exsist');

        const payload = UserTransformer.create(req.body);
        const newUser = await User.create(payload);

        const { token, refresh: refreshToken } = await newUser.sign();

        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return httpResponse(res, 'register success', response);
    } catch (err) {
        if (err.status) return next(err);
        return next(HttpException.InternalServerError(err.message));
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }], is_complete: true });
        if (!user) throw HttpException.NotAuthorized('Credentials not match');

        const { token, refresh: refreshToken } = await user.signIn(req.body.password);
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return httpResponse(res, 'login success', response);
    } catch (err) {
        if (err.status) return next(err);
        return next(HttpException.InternalServerError(err.message));
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const user = await User.findOne({ 'refresh_token.token': req.body.refresh_token });
        if (!user) throw HttpException.NotAuthorized('refresh token invalid');

        const token = await user.signByRefresh();
        const response = {
            new_token: token,
            expires_in: Config.expired
        };
        return httpResponse(res, 'token refreshed', response);
    } catch (err) {
        if (err.status) return next(err);
        return next(HttpException.InternalServerError(err.message));
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
            throw HttpException.BadRequest('id token invalid');
        }

        const jwtPayload = ticket.getPayload();
        const payload = UserTransformer.googleCallback(jwtPayload);

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            const newPayload = UserTransformer.create({ ...payload }, { is_complete: false });
            user = await User.create(newPayload);
        }

        const { token, refresh: refreshToken } = await user.sign();
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return httpResponse(res, 'auth success', response);
    } catch (err) {
        if (err.status) return next(err);
        return next(HttpException.InternalServerError(err.message));
    }
};

module.exports = exports;
