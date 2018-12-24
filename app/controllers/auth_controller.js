'use strict';

const { OAuth2Client } = require('google-auth-library');

const { httpResponse, exception } = require('../utils/helpers');
const User = require('../models/user_model');
const Config = require('../config/jwt');
const UserTransformer = require('../utils/transformers/user_transformer');

exports.register = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) throw exception('email already exsist', 422);

        user = await User.findOne({ username: req.body.username });
        if (user) throw exception('username already exsist', 422);

        const payload = UserTransformer.create(req.body);
        const newUser = await User.create(payload);

        const { token, refresh: refreshToken } = await newUser.sign();

        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return httpResponse(res, 'register successfull', 200, response);
    } catch (err) {
        return next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }], is_complete: true });
        if (!user) throw exception('Credentials not match', 401);

        const { token, refresh: refreshToken } = await user.signIn(req.body.password);
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return httpResponse(res, 'login successfull', 200, response);
    } catch (err) {
        return next(err);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const user = await User.findOne({ 'refresh_token.token': req.body.refresh_token });
        if (!user) throw exception('Not Authorized', 401);

        const token = await user.signByRefresh();
        const response = {
            new_token: token,
            expires_in: Config.expired
        };
        return httpResponse(res, 'token refreshed', 200, response);
    } catch (err) {
        return next(err);
    }
};

exports.googleCallback = async (req, res, next) => {
    try {
        const idToken = req.body.idToken;
        const client = new OAuth2Client(process.env.FIREBASE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.FIREBASE_CLIENT_ID
        });
        const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            const newPayload = UserTransformer.create({ ...req.body.profile, email: payload.email }, { is_complete: false });
            user = await User.create(newPayload);
        }

        const { token, refresh: refreshToken } = await user.sign();
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return httpResponse(res, 'login successfull', 200, response);
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
