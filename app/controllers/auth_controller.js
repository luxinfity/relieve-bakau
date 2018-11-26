const bcrypt = require('bcryptjs');
const moment = require('moment');
const { apiResponse, exception } = require('../utils/helpers');
const UserRepo = require('../repositories/user_repo');
const RefreshTokenRepo = require('../repositories/refresh_token_repo');
const UserTransformer = require('../utils/transformers/user_transformer');
const Config = require('../config/jwt');
const JWT = require('../utils/jwt');

exports.login = async (req, res, next) => {
    try {
        const user = await UserRepo.findOne({ username: req.body.username });
        if (!user) return next(exception('Credentials not match', 401));
        if (!bcrypt.compareSync(req.body.password, user.password)) return next(exception('Credentials not match', 401));

        const token = await JWT.create(UserTransformer(user));
        const refresh = await JWT.generateRefreshToken();

        await RefreshTokenRepo.createOrUpdate({ userId: user.id, token: refresh.token, expiredAt: refresh.validity });

        const response = {
            token,
            refresh_token: refresh.token,
            expires_in: Config.expired,
            expired_at: refresh.validity
        };

        return apiResponse(res, 'login successful', 200, response);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const refresh = await RefreshTokenRepo.findOne({ token: req.body.refresh_token });
        if (!refresh) return next(exception('Not Authorized', 401));
        if (moment() > moment(refresh.expiredAt)) return next(exception('Not Authorized', 401));

        const user = UserRepo.findOne({ id: refresh.userId });
        const token = await JWT.create({
            id: user.id,
            username: user.username
        });

        const response = {
            new_token: token
        };

        return apiResponse(res, 'refresh token successful', 200, response);
    } catch (err) {
        return next(exception(err.message));
    }
};

module.exports = exports;
