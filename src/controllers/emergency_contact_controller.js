'use strict';

const Promise = require('bluebird');
const { HttpResponse } = require('../utils/helpers');
const { EMERGENCY_CONTACT_TYPES: TYPES } = require('../utils/constant');
const GMaps = require('../utils/gmaps');

exports.discover = async (req, res, next) => {
    try {
        const client = await GMaps.getClient();
        const result = await Promise.map(TYPES, type => client.placesNearby({ location: req.body.coordinates, radius: req.body.radius, type })
            .asPromise()
            .then(({ json: { results: places } }) => places.map(item => ({ name: item.name, place_id: item.place_id, type }))));
        return HttpResponse(res, 'success', result.reduce((acc, val) => acc.concat(val), []));
    } catch (err) {
        return next(err);
    }
};

exports.discoverDetail = async (req, res, next) => {
    try {
        const { params } = req;
        const client = await GMaps.getClient();
        const { json: { result: data } } = await client.place({ placeid: params.id, fields: [] }).asPromise();
        return HttpResponse(res, 'success', data);
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
