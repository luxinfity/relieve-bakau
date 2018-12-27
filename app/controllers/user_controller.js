const HttpResponse = require('../utils/helpers').HttpResponse;
const HttpException = require('../utils/http_exception');
const User = require('../models/user_model');
const Position = require('../models/position_model');
const UserTrans = require('../utils/transformers/user_transformer');

exports.profile = async (req, res, next) => {
    try {
        const user = await User.findOne({ uuid: req.auth.uid });
        return HttpResponse(res, 'successy retrieved profile data', UserTrans.profile(user));
    } catch (err) {
        return next(HttpException.InternalServerError(err.message));
    }
};

exports.completeRegister = async (req, res, next) => {
    try {
        const user = await User.findOne({ uuid: req.auth.uid, is_complete: false });
        if (!user) throw HttpException.Forbidden('profile already completed');

        // will be improved later...
        const check = await User.findOne({ username: req.body.username });
        if (check) throw HttpException.UnprocessableEntity('username alerady exsist');

        const payload = UserTrans.completeRegister(req.body);
        await user.update(payload);

        return HttpResponse(res, 'complete register success');
    } catch (err) {
        return next(err);
    }
};

exports.updatePosition = async (req, res, next) => {
    try {
        const payload = UserTrans.updatePosition(req);
        await Position.create(payload);
        return HttpResponse(res, 'position and status updated');
    } catch (err) {
        return next(HttpException.InternalServerError(err.message));
    }
};

exports.updateFcmToken = async (req, res, next) => {
    try {
        const payload = {
            fcm_token: req.body.fcm_token
        };
        await User.updateOne({ uuid: req.auth.uid }, payload);
        return HttpResponse(res, 'fcm update success');
    } catch (err) {
        return next(HttpException.InternalServerError(err.message));
    }
};

module.exports = exports;
