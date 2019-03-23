'use strict';

const { HttpError } = require('node-common');
const Promise = require('bluebird');
const { HttpResponse } = require('../utils/helpers');

const Repository = require('../repositories');
const { familyRequest, familyList, requestList } = require('../utils/transformers/family_transformer');
const { FAMILIY_REQUEST_STATUS: STATUS } = require('../utils/constant');

const pairUsers = async (userIds) => {
    const Repo = new Repository();

    return Promise.map(userIds, (uid) => {
        const jobs = [];
        userIds.forEach((pid) => {
            if (uid !== pid) {
                jobs.push(
                    Repo.get('family').updateOne(
                        { user_id: uid, family_id: pid },
                        { family_id: pid },
                        { upsert: true, setDefaultsOnInsert: true }
                    )
                );
            }
        });
        return Promise.all(jobs);
    }, { concurrency: 5 });
};

exports.createRequest = async (req, res, next) => {
    try {
        const Repo = new Repository();

        // TODO: check family limit
        const person = await Repo.get('user').findOne({ username: req.body.username });
        if (!person) throw HttpError.BadRequest('requested person not found');

        if (req.auth.uid === person.uuid) throw HttpError.Forbidden('cannot request to yourself');

        const check = await Repo.get('family').findOne({ user_id: req.auth.uid, 'family.id': person.uuid });
        if (check) throw HttpError.BadRequest('person already in family list');

        await Repo.get('family').updateRequest(
            { requestor_id: req.auth.uid, target_id: person.uuid },
            familyRequest(req, person),
            { upsert: true, setDefaultsOnInsert: true }
        );

        // TODO: notify requested target

        return HttpResponse(res, 'family request sent');
    } catch (err) {
        return next(err);
    }
};

exports.verifyRequest = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const person = await Repo.get('user').findOne({ username: req.body.username });
        if (!person) throw HttpError.BadRequest('requested person not found');

        const request = await Repo.get('family').requestDetail(req.auth.uid, person.uuid, req.body.code, STATUS.WAITING_VERIFICATION);
        if (!request) throw HttpError.BadRequest('family request not found or invalid');

        await Promise.join(
            Repo.get('family').updateRequest(
                { uuid: request.uuid },
                { status: STATUS.VERIFIED }
            ),
            pairUsers([req.auth.uid, request.target_id])
        );

        return HttpResponse(res, 'family request verified');
    } catch (err) {
        return next(err);
    }
};

exports.requestList = async (req, res, next) => {
    try {
        const Repo = new Repository();
        const requests = await Repo.get('family').requestList(req.auth.uid, STATUS.WAITING_VERIFICATION);

        return HttpResponse(res, 'family request list retrieved', requestList(requests));
    } catch (err) {
        return next(err);
    }
};

exports.list = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const families = await Repo.get('family').detailedList(req.auth.uid);

        const transformed = familyList(families);
        return HttpResponse(res, 'family list retrieved', transformed);
    } catch (err) {
        return next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const family = await Repo.get('family').findOne({ uuid: req.params.uuid });
        if (!family) throw HttpError.BadRequest('family not found');

        const payload = { ...req.body };
        await Repo.get('family').updateOne({ uuid: family.uuid }, payload);

        return HttpResponse(res, 'family updated');
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
