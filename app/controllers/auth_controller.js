const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { apiResponse, exception } = require('../utils/helpers');
const UserRepo = require('../repositories/user_repo');
const Config = require('../config/jwt');
const { signUser } = require('../utils/adapters/auth');
const RefreshTokenRepo = require('../repositories/refresh_token_repo');
const UserTrans = require('../utils/transformers/user_transformer');

exports.register = async (req, res, next) => {
    try {
        let user = await UserRepo.findOne({ email: req.body.email });
        if (user) return next(exception('email already exsist', 422));

        user = await UserRepo.findOne({ username: req.body.username });
        if (user) return next(exception('username already exsist', 422));

        const payload = UserTrans.create(req.body);
        const newUser = await UserRepo.create(payload);

        const { token, refresh } = await signUser(newUser);
        const response = {
            token,
            refresh_token: refresh.token,
            expires_in: Config.expired
        };

        return apiResponse(res, 'register successfull', 200, response);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await UserRepo.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }], isComplete: true });
        if (!user) return next(exception('Credentials not match', 401));
        if (!bcrypt.compareSync(req.body.password, user.password)) return next(exception('Credentials not match', 401));

        const payload = { 
            fcm_token: req.body.fcm_token
        };
        await UserRepo.update({ username: req.body.username }, payload);

        const { token, refresh } = await signUser(user);
        const response = {
            token,
            refresh_token: refresh.token,
            expires_in: Config.expired
        };

        return apiResponse(res, 'login successfull', 200, response);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const refreshToken = await RefreshTokenRepo.findOne({ token: req.body.refresh_token });
        if (!refreshToken) return next(exception('Not Authorized', 401));
        if (moment() > moment(refreshToken.expiredAt)) return next(exception('refresh token expired', 401));

        const user = await UserRepo.findById(refreshToken.userId);
        const { token } = await signUser(user, { withRefresh: false });

        const response = {
            new_token: token,
            expires_in: Config.expired
        };
        return apiResponse(res, 'refresh token successfull', 200, response);
    } catch (err) {
        return next(exception(err.message));
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

        let user = await UserRepo.findOne({ email: payload.email });
        if (!user) {
            const newPayload = UserTrans.create({ ...req.body.profile, email: payload.email }, { isComplete: false });
            user = await UserRepo.create(newPayload);
        }

        const { token, refresh } = await signUser(user);
        const response = {
            token,
            refresh_token: refresh.token,
            expires_in: Config.expired
        };

        return apiResponse(res, 'login successfull', 200, response);
    } catch (err) {
        return next(exception('an error occured', 500, err.message));
    }
};

module.exports = exports;
