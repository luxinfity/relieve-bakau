'use strict';

const { HttpError } = require('node-common');
const Promise = require('bluebird');

const Place = require('../utils/adapters/places');
const Repository = require('../repositories');

const EmergencyTrans = require('../utils/transformers/emergency_contact_transformer');
const { create } = require('../utils/transformers/google_place_transformer');
const { address_components: components } = require('../utils/transformers/address_transformer');

exports.places = async (data, context) => {
    try {
        const result = await Place.placeNearby(data.body.coordinates, data.body.radius);

        return {
            message: 'nearby places retrieved',
            data: result
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.placesDetail = async (data, context) => {
    try {
        const result = await Place.placeDetail(data.params.id);

        return {
            message: 'place detail retrieved',
            data: result
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.nearbyContacts = async (data, context) => {
    try {
        const Repo = new Repository();

        const places = await Place.placeNearby(data.query.coordinates, data.query.radius);
        const mapped = await Promise.map(places, place => Repo.get('place').findOne({ google_place_id: place.place_id })
            .then((gplace) => {
                if (gplace) return EmergencyTrans.show(gplace);
                return Place.placeDetail(place.place_id)
                    .then((item) => {
                        if (!item.international_phone_number) return null;
                        return Repo.get('place').create(create(item, place.type)).then(() => EmergencyTrans.show(item));
                    });
            }), { concurrency: 10 });

        return {
            message: 'nearby emergency contacts',
            data: mapped.filter(item => item)
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.addressDetail = async (data, context) => {
    try {
        const [{ address_components: result = null }] = await Place.reverseGeocode(data.query.coordinates);

        return {
            message: 'address detail retrieved',
            data: components(result)
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
