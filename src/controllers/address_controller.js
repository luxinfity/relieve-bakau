'use strict';

const Promise = require('bluebird');

const { HttpResponse } = require('../utils/helpers');
const HttpError = require('../utils/http_error');
const Address = require('../models/address_model');
const Trans = require('../utils/transformers/address_transformer');
const Place = require('../utils/adapters/places');
const GooglePlace = require('../models/place_model');
const EmergencyContact = require('../models/emergency_contact_model');
const { createNew, createFromPlace } = require('../utils/transformers/emergency_contact_transformer');
const { create } = require('../utils/transformers/google_place_transformer');

const generateEmergencyContacts = async (address) => {
    const [lng, lat] = address.geograph.coordinates;
    const placesNearby = await Place.placeNearby(`${lat}, ${lng}`, 1500);

    // reduce places to object
    const placesReduced = await GooglePlace.find({ google_place_id: placesNearby.map(item => item.place_id) })
        .then(places => places.reduce((res, item) => {
            res[item.google_place_id] = item;
            return res;
        }, {}));

    // concurrently create emergency contacts
    await Promise.map(placesNearby, (place) => {
        // if location already in db, create from it
        if (placesReduced[place.place_id]) {
            return EmergencyContact.create(createFromPlace(placesReduced[place.place_id], address));
        }

        // if not, get place detail from google and store place then create contact
        return Place.placeDetail(place.place_id)
            .then((placeDetail) => {
                // if place doesnt have phone number, abort creation
                if (!placeDetail.international_phone_number) return null;
                return Promise.join(
                    GooglePlace.create(create(placeDetail, place.type)),
                    EmergencyContact.create(createNew(placeDetail, place.type, address))
                );
            });
    }, { concurrency: 10 });
};

exports.create = async (req, res, next) => {
    try {
        const [{ address_components: addressDetail = null }] = await Place.reverseGeocode(req.body.coordinates);

        const payload = Trans.create(req, addressDetail);
        const find = await Address.findOne({ 'geograph.coordinates': payload.geograph.coordinates });
        if (find) throw HttpError.Forbidden('address already exsist');

        const address = await Address.create(payload);
        await generateEmergencyContacts(address);

        return HttpResponse(res, 'address created', payload);
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

exports.detail = async (req, res, next) => {
    try {
        const address = await Address.findOne({ user_id: req.auth.uid, uuid: req.params.id }).populate('emergency_contacts');
        if (!address) throw HttpError.NotFound('address not found');
        return HttpResponse(res, 'address detail retrieved', Trans.detail(address));
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
