'use strict';

const Promise = require('bluebird');

const Repository = require('../repositories');
const Place = require('../utils/adapters/places');
const { createNew, createFromPlace } = require('../utils/transformers/emergency_contact_transformer');
const { create: createNewPlace } = require('../utils/transformers/google_place_transformer');
const { RADIUS } = require('../utils/constant');

module.exports = async (address) => {
    const Repo = new Repository();

    const [lng, lat] = address.geograph.coordinates;
    const placesNearby = await Place.placeNearby(`${lat}, ${lng}`, RADIUS.EMERGENCY_CONTACT);

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
                    Repo.get('place').create(createNewPlace(placeDetail, place.type)),
                    Repo.get('emergencyContact').create(createNew(placeDetail, place.type, address))
                );
            });
    }, { concurrency: 10 });
};
