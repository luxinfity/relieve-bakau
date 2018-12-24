const bcrypt = require('bcryptjs');
const moment = require('moment');
const httpResponse = require('../utils/helpers').httpResponse;
const HttpException = require('../utils/http_exception');
const User = require('../models/user_model');
const Position = require('../models/position_model');
const UserTrans = require('../utils/transformers/user_transformer');

exports.profile = async (req, res, next) => {
    try {
        const user = await User.findOne({ uuid: req.auth.uid });
        return httpResponse(res, 'successfully retrieved profile data', UserTrans.profile(user));
    } catch (err) {
        return next(HttpException.InternalServerError(err.message));
    }
};

exports.completeRegister = async (req, res, next) => {
    try {
        const user = await User.findOne({ uuid: req.auth.uid, is_complete: false });
        if (!user) throw HttpException.Forbidden('profile already completed');

        const payload = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 8),
            birthdate: moment(req.body.birthdate).format('YYYY-MM-DD'),
            is_complete: true
        };

        await user.update(payload);
        return httpResponse(res, 'complete register successfull');
    } catch (err) {
        if (err.status) return next(err);
        return next(HttpException.InternalServerError(err.message));
    }
};

exports.updatePosition = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            user_id: req.auth.uid
        };
        await Position.create(payload);
        return httpResponse(res, 'position and status updated');
    } catch (err) {
        return next(HttpException.InternalServerError(err.message));
    }
};

exports.updateFcmToken = async (req, res, next) => {
    try {
        const payload = {
            fcm_token: req.body.fcm_token
        };
        await User.update({ uuid: req.auth.uid }, payload);
        return httpResponse(res, 'fcm created or updated');
    } catch (err) {
        return next(HttpException.InternalServerError(err.message));
    }
};

module.exports = exports;
