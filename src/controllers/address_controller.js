'use strict';

const Promise = require('bluebird');

const { HttpResponse } = require('../utils/helpers');
const { HttpError } = require('../common');

const Place = require('../utils/adapters/places');
const Repository = require('../repositories');
const { createNew, createFromPlace } = require('../utils/transformers/emergency_contact_transformer');
const { create } = require('../utils/transformers/google_place_transformer');
const { create: createAddress, list: addressList, detail } = require('../utils/transformers/address_transformer');

const RADIUS = 1500; // meters

const generateEmergencyContacts = async (address) => {
    const Repo = new Repository();

    const [lng, lat] = address.geograph.coordinates;
    const placesNearby = await Place.placeNearby(`${lat}, ${lng}`, RADIUS);

    // reduce places to object
    const placesReduced = await Repo.get('place').findAll({ google_place_id: placesNearby.map(item => item.place_id) })
        .then(places => places.reduce((res, item) => {
            res[item.google_place_id] = item;
            return res;
        }, {}));

    // concurrently create emergency contacts
    await Promise.map(placesNearby, (place) => {
        // if location already in db, create from it
        if (placesReduced[place.place_id]) {
            return Repo.get('emergencyContact').create(createFromPlace(placesReduced[place.place_id], address));
        }

        // if not, get place detail from google and store place then create contact
        return Place.placeDetail(place.place_id)
            .then((placeDetail) => {
                // if place doesnt have phone number, abort creation
                if (!placeDetail.international_phone_number) return null;
                return Promise.join(
                    Repo.get('place').create(create(placeDetail, place.type)),
                    Repo.get('emergencyContact').create(createNew(placeDetail, place.type, address))
                );
            });
    }, { concurrency: 10 });
};

exports.create = async (req, res, next) => {
    try {
        const Repo = new Repository();
        const [{ address_components: addressDetail = null }] = await Place.reverseGeocode(req.body.coordinates);

        const payload = createAddress(req, addressDetail);
        const find = await Repo.get('address').findOne({ 'geograph.coordinates': payload.geograph.coordinates });
        if (find) throw HttpError.Forbidden('address already exsist');

        const address = await Repo.get('address').create(payload);

        // should be async or queued
        await generateEmergencyContacts(address);

        return HttpResponse(res, 'address created', payload);
    } catch (err) {
        return next(err);
    }
};

exports.list = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const addresses = await Repo.get('address').findAll({ user_id: req.auth.uid });
        return HttpResponse(res, 'addresses retrieved', addressList(addresses));
    } catch (err) {
        return next(err);
    }
};

exports.detail = async (req, res, next) => {
    try {
        const Repo = new Repository();

        const address = await Repo.get('address').findDetailed(req.auth.uid, req.params.id);
        if (!address) throw HttpError.NotFound('address not found');

        return HttpResponse(res, 'address detail retrieved', detail(address));
    } catch (err) {
        return next(err);
    }
};

module.exports = exports;
