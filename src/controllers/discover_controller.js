'use strict';

const Promise = require('bluebird');
const { HttpResponse } = require('../utils/helpers');

const Place = require('../utils/adapters/places');
const Repository = require('../repositories');

const EmergencyTrans = require('../utils/transformers/emergency_contact_transformer');
const { create } = require('../utils/transformers/google_place_transformer');
const { address_components: components } = require('../utils/transformers/address_transformer');

exports.places = async (req, res, next) => {
    try {
        const result = await Place.placeNearby(req.body.coordinates, req.body.radius);
        return HttpResponse(res, 'nearby places retrieved', result);
    } catch (err) {
        return next(err);
    }
};

exports.placesDetail = async (req, res, next) => {
    try {
        const result = await Place.placeDetail(req.params.id);
        return HttpResponse(res, 'place detail retrieved', result);
    } catch (err) {
        return next(err);
    }
};

exports.nearbyContacts = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const places = await Place.placeNearby(req.query.coordinates, req.query.radius);
        const mapped = await Promise.map(places, place => Repo.get('place').findOne({ google_place_id: place.place_id })
            .then((gplace) => {
                if (gplace) return EmergencyTrans.show(gplace);
                return Place.placeDetail(place.place_id)
                    .then((item) => {
                        if (!item.international_phone_number) return null;
                        return Repo.get('place').create(create(item, place.type)).then(() => EmergencyTrans.show(item));
                    });
            }), { concurrency: 10 });
        return HttpResponse(res, 'nearby emergency contacts', mapped.filter(item => item));
    } catch (err) {
        return next(err);
    }
};

exports.addressDetail = async (req, res, next) => {
    try {
        const [{ address_components: result = null }] = await Place.reverseGeocode(req.query.coordinates);
        return HttpResponse(res, 'address detail retrieved', components(result));
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
