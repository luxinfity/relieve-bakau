const bcrypt = require('bcryptjs');
const moment = require('moment');
const { apiResponse, exception } = require('../utils/helpers');
const UserRepo = require('../repositories/user_repo');
const Location = require('../repositories/location_history_repo');
const UserTrans = require('../utils/transformers/user_transformer');
const FCM = require('../repositories/fcm_token_repo');

exports.profile = async (req, res, next) => {
    try {
        const user = await UserRepo.findById(req.auth.uid);
        const response = UserTrans.profile(user);
        return apiResponse(res, 'successfully retrieved profile data', 200, response);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.completeRegister = async (req, res, next) => {
    try {
        const user = await UserRepo.findOne({ uuid: req.auth.uid, is_complete: false });
        if (!user) return next(exception('profile already completed', 403));

        const payload = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 8),
            birthdate: moment(req.body.birthdate).format('YYYY-MM-DD'),
            is_complete: true
        };
        await UserRepo.update({ uuid: req.auth.uid }, payload);

        return apiResponse(res, 'complete register successfull', 200);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.updateLocation = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            user_id: req.auth.uid
        };
        await Location.create(payload);
        return apiResponse(res, 'location and status updated', 201);
    } catch (err) {
        return next(exception('an error occured', 500, err.message));
    }
};

exports.updateFcmToken = async (req, res, next) => {
    try {
        const payload = {
            user_id: req.auth.uid,
            token: req.body.fcm_token
        };
        await FCM.createOrUpdate({ user_id: req.auth.uid }, payload);
        return apiResponse(res, 'fcm created/updated', 200);
    } catch (err) {
        return next(exception('an error occured', 500, err.message));
    }
};

module.exports = exports;
