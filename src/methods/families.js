'use strict';

const { HttpError } = require('relieve-common');
const Promise = require('bluebird');

const Repository = require('../repositories');
const { familyRequest, familyList, requestList } = require('../utils/transformers/family_transformer');
const { FAMILIY_REQUEST_STATUS: STATUS, FAMILIY_LIMIT, MESSAGING_TEMPLATE } = require('../utils/constant');
const Message = require('../utils/messaging');

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

exports.createRequest = async (data, context) => {
    try {
        const Repo = new Repository();

        const totalConnection = await Repo.get('family').count({ user_id: context.id });
        if (totalConnection >= FAMILIY_LIMIT) throw HttpError.Forbidden('family limit already reach');

        const person = await Repo.get('user').findOne({ username: data.body.username });
        if (!person) throw HttpError.BadRequest('requested person not found');

        if (context.id === person.id) throw HttpError.Forbidden('cannot request to yourself');

        const check = await Repo.get('family').findOne({ user_id: context.id, 'family.id': person.id });
        if (check) throw HttpError.BadRequest('person already in family list');

        const payload = familyRequest(context, person);
        await Repo.get('family').updateRequest(
            { requestor_id: context.id, target_id: person.id }, payload, { upsert: true, setDefaultsOnInsert: true }
        );

        /** send notification to requested person */
        if (person.fcm_token) {
            await Message.sendToDevice(person.fcm_token,
                { notification: MESSAGING_TEMPLATE.FAMILY_REQUEST, data: { name: person.fullname, code: payload.pair_code } });
        }

        return {
            message: 'family request sent'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.verifyRequest = async (data, context) => {
    try {
        const Repo = new Repository();

        const request = await Repo.get('family').requestDetail(data.body.request_id, context.id, data.body.code, STATUS.WAITING_VERIFICATION);
        if (!request) throw HttpError.BadRequest('family request not found or invalid');

        await Promise.join(
            Repo.get('family').updateRequest(
                { _id: request.id },
                { status: STATUS.VERIFIED }
            ),
            pairUsers([context.id, request.requestor_id])
        );

        return {
            message: 'family request verified'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.requestList = async (data, context) => {
    try {
        const Repo = new Repository();
        const requests = await Repo.get('family').requestList(context.id, STATUS.WAITING_VERIFICATION);

        return {
            message: 'family request list retrieved',
            data: requestList(requests)
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.list = async (data, context) => {
    try {
        const Repo = new Repository();
        const families = await Repo.get('family').detailedList(context.id);

        const transformed = familyList(families);
        return {
            message: 'family list retrieved',
            data: transformed
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.update = async (data, context) => {
    try {
        const Repo = new Repository();

        const family = await Repo.get('family').findOne({ _id: data.params.id });
        if (!family) throw HttpError.BadRequest('family not found');

        const payload = { ...data.body };
        await Repo.get('family').updateOne({ _id: family.id }, payload);

        return {
            message: 'family updated'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.ping = async (data, context) => {
    try {
        const { params: { id }, body: { ping_type: pingType } } = data;
        const Repo = new Repository();

        const connection = await Repo.get('family').findOne({ _id: id });
        if (!connection) throw HttpError.BadRequest('family not found');

        /** */
        if (connection.family.fcm_token) {
            await Message.sendToDevice(connection.family.fcm_token,
                { notification: MESSAGING_TEMPLATE[pingType], data: { token: connection.family.fcm_token } });
        }

        return {
            message: 'ping'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
