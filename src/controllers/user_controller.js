'use strict';

const { HttpError } = require('node-common');
const HttpResponse = require('../utils/helpers').HttpResponse;

const Repository = require('../repositories');
const { profile, completeRegister } = require('../utils/transformers/user_transformer');

exports.profile = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const user = await Repo.get('user').findOne({ uuid: req.auth.uid });
        return HttpResponse(res, 'successy retrieved profile data', profile(user));
    } catch (err) {
        return next(err);
    }
};

exports.completeRegister = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const user = await Repo.get('user').findOne({ uuid: req.auth.uid, is_complete: false });
        if (!user) throw HttpError.Forbidden('profile already completed');

        const check = await Repo.get('user').findOne({ username: req.body.username });
        if (check) throw HttpError.UnprocessableEntity('username alerady exsist');

        const payload = completeRegister(req.body);
        await user.update(payload);

        return HttpResponse(res, 'complete register success');
    } catch (err) {
        return next(err);
    }
};

exports.updateFcmToken = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const payload = {
            fcm_token: req.body.fcm_token
        };
        await Repo.get('user').updateOne({ uuid: req.auth.uid }, payload);
        return HttpResponse(res, 'fcm update success');
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
