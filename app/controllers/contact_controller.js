const Promise = require('bluebird');
const { httpResponse, exception } = require('../utils/helpers');
const GMaps = require('../utils/google_maps');

exports.discover = async (req, res, next) => {
    try {
        const types = ['police', 'fire_station', 'hospital'];
        const client = await GMaps.getClient();
        const result = await Promise.map(types, type => client.placesNearby({ position: '-6.187823, 106.847826', radius: 1500, type })
            .asPromise()
            .then(({ json: { results: places } }) => places.map(item => item.name)));

        return httpResponse(res, 'success', result);
    } catch (err) {
        return next(exception('an error occured', err.message, 500));
    }
};

module.exports = exports;
