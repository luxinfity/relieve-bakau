'use strict';

const { HttpResponse } = require('../utils/helpers');
const Position = require('../models/mongodb/position_model');
const Trans = require('../utils/transformers/position_transformer');

exports.create = async (req, res, next) => {
    try {
        const payload = Trans.create(req);
        await Position.create(payload);
        return HttpResponse(res, 'position and status updated');
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
