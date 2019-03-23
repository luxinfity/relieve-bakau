'use strict';

const Promise = require('bluebird');
const { HttpError } = require('node-common');

const Place = require('../utils/adapters/places');
const Repository = require('../repositories');
const { createNew, createFromPlace } = require('../utils/transformers/emergency_contact_transformer');
const { create } = require('../utils/transformers/google_place_transformer');
const { create: createAddress, list: addressList, detail } = require('../utils/transformers/address_transformer');

const RADIUS = 1500; // meters
const ADDRESS_MIN_RADIUS = 50; // meters

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

exports.create = async (data, context) => {
    try {
        const Repo = new Repository();
        const [{ address_components: addressDetail = null }] = await Place.reverseGeocode(data.body.coordinates);

        const payload = createAddress({ data, context }, addressDetail);

        /** check if address already exsist by distance */
        const find = await Repo.get('address').findNearby({ user_id: context.id }, payload.geograph.coordinates, ADDRESS_MIN_RADIUS);
        if (find) throw HttpError.Forbidden('address already exsist');

        const address = await Repo.get('address').create(payload);

        /** should be async or queued */
        await generateEmergencyContacts(address);

        return {
            message: 'address created',
            data: payload
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.list = async (data, context) => {
    try {
        const Repo = new Repository();
        const addresses = await Repo.get('address').findAll({ user_id: context.id });

        return {
            message: 'addresses retrieved',
            data: addressList(addresses)
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.detail = async (data, context) => {
    try {
        const Repo = new Repository(context);

        const address = await Repo.get('address').findDetailed(data.params.id);
        if (!address) throw HttpError.NotFound('address not found');

        return {
            message: 'address detail retrieved',
            data: detail(address)
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
