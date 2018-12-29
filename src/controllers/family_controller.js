const Promise = require('bluebird');

const { HttpResponse } = require('../utils/helpers');
const HttpError = require('../utils/http_error');
const User = require('../models/user_model');
const Family = require('../models/family_model');
const FamilyRequest = require('../models/family_request_model');
const Trans = require('../utils/transformers/family_transformer');
const { FAMILIY_REQUEST_STATUS: STATUS } = require('../utils/constant');

const pairUsers = async userIds => Promise.map(userIds, (uid) => {
    const jobs = [];
    userIds.forEach((pid) => {
        if (uid !== pid) jobs.push(Family.updateOne({ user_id: uid }, { 'family.id': pid }, { upsert: true, setDefaultsOnInsert: true }));
    });
    return Promise.all(jobs);
}, { concurrency: 10 });

exports.createRequest = async (req, res, next) => {
    try {
        const person = await User.findOne({ username: req.body.username });
        if (!person) throw HttpError.BadRequest('requested person not found');

        if (req.auth.uid === person.uuid) throw HttpError.Forbidden('cannot request to yourself');

        const check = await Family.findOne({ user_id: req.auth.uid, 'family.id': person.uuid });
        if (check) throw HttpError.BadRequest('person already in family list');

        await FamilyRequest.create(Trans.familyRequest(req, person));

        // notify target

        return HttpResponse(res, 'family request sent');
    } catch (err) {
        return next(err);
    }
};

exports.verifyRequest = async (req, res, next) => {
    try {
        const person = await User.findOne({ username: req.body.username });
        if (!person) throw HttpError.BadRequest('requested person not found');

        const request = await FamilyRequest.findOne({
            requestor_id: req.auth.uid, target_id: person.uuid, pair_code: req.body.code, status: STATUS.WAITING_VERIFICATION
        });
        if (!request) throw HttpError.BadRequest('family request not found or invalid');

        await Promise.join(request.update({ status: STATUS.VERIFIED }), pairUsers([req.auth.uid, request.target_id]));

        return HttpResponse(res, 'family request verified');
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
