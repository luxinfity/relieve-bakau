'use strict';

const Promise = require('bluebird');
const { HttpResponse } = require('../utils/helpers');
const GMaps = require('../utils/gmaps');

exports.discover = async (req, res, next) => {
    try {
        const types = ['police', 'fire_station', 'hospital'];
        const client = await GMaps.getClient();
        const result = await Promise.map(types, type => client.placesNearby({ position: '-6.187823, 106.847826', radius: 1500, type })
            .asPromise()
            .then(({ json: { results: places } }) => places.map(item => item.name)));
        return HttpResponse(res, 'success', result);
    } catch (err) {
        return next(err);
    }
};

exports.list = async (req, res, next) => {
    try {
        return HttpResponse(res, 'emergency contacts retrieved', []);
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
