'use strict';

const { HttpResponse } = require('../utils/helpers');
// const HttpError = require('../utils/http_error');
const Address = require('../models/address_model');
const Trans = require('../utils/transformers/address_transformer');

exports.create = async (req, res, next) => {
    try {
        await Address.create(Trans.create(req));
        return HttpResponse(res, 'address created');
    } catch (err) {
        return next(err);
    }
};

exports.list = async (req, res, next) => {
    try {
        const addresses = await Address.find({ user_id: req.auth.uid });
        return HttpResponse(res, 'addresses retrieved', Trans.list(addresses));
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
