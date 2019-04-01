'use strict';

const { HttpError, JobWorker } = require('relieve-common');

const Repository = require('../../repositories');
const Place = require('../adapters/places');
const { create: createAddress } = require('../transformers/address_transformer');
const { RADIUS, JOBS } = require('../constant');

exports.createNewAddress = async (data, userId) => {
    const Repo = new Repository();
    const [{ address_components: addressDetail = null }] = await Place.reverseGeocode(data.coordinates);

    const payload = createAddress({ data, user_id: userId }, addressDetail);

    /** check if address already exsist by distance */
    const find = await Repo.get('address').findNearby({ user_id: userId }, payload.geograph.coordinates, RADIUS.ADDRESS_CREATION);
    if (find) throw HttpError.Forbidden('address already exsist');

    const address = await Repo.get('address').create(payload);

    /** should be async or queued */
    await JobWorker.dispatch(JOBS.GENERATE_EMERGENCY_CONTACT, address);
};

module.exports = exports;
