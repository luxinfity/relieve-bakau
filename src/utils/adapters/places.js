'use strict';

const Promise = require('bluebird');
const HttpError = require('../../utils/http_error');
const { EMERGENCY_CONTACT_TYPES: TYPES } = require('../../utils/constant'); const GMaps = require('../../utils/gmaps');

exports.placeNearby = async (coordinates, radius) => {
    try {
        const client = await GMaps.getClient();
        const result = await Promise.map(TYPES, type => client.placesNearby({ location: coordinates, radius, type })
            .asPromise()
            .then(({ json: { results: places } }) => places.map(item => ({ name: item.name, place_id: item.place_id, type }))));
        return result.reduce((acc, val) => acc.concat(val), []); // flatened result
    } catch (err) {
        throw HttpError.InternalServerError(err.message);
    }
};

exports.placeDetail = async (placeId) => {
    try {
        const client = await GMaps.getClient();
        const { json: { result: data } } = await client.place({ placeid: placeId, fields: [] }).asPromise();
        return data;
    } catch (err) {
        throw HttpError.InternalServerError(err.message);
    }
};

exports.reverseGeocode = async (coordinates) => {
    try {
        const client = await GMaps.getClient();
        const { json: { results: data } } = await client.geocode({ address: coordinates }).asPromise();
        return data;
    } catch (err) {
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
