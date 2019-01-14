'use strict';

const { HttpResponse } = require('../utils/helpers');
const User = require('../models/user_model');
const Config = require('../config/jwt');
const UserTransformer = require('../utils/transformers/user_transformer');
const HttpError = require('../utils/http_error');
const GAuth = require('../utils/gauth');

exports.register = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) throw HttpError.UnprocessableEntity('email already exsist');

        user = await User.findOne({ username: req.body.username });
        if (user) throw HttpError.UnprocessableEntity('username already exsist');

        const payload = UserTransformer.create(req.body);
        const newUser = await User.create(payload);

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
        const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }], is_complete: true });
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
        const user = await User.findOne({ 'refresh_token.token': req.body.refresh_token });
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
        const payload = UserTransformer.googleCallback(jwtPayload);

        let isLogin = true;
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            const newPayload = UserTransformer.create({ ...payload }, { is_complete: false });
            isLogin = !isLogin;
            user = await User.create(newPayload);
        }

        const { token, refresh: refreshToken } = await user.sign();
        const action = isLogin ? 'login' : 'register';
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired,
            action
        };

        return HttpResponse(res, `${action} success`, response);
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
