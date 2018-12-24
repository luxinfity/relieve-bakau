const Promise = require('bluebird');
const { httpResponse, exception } = require('../utils/helpers');
const GMaps = require('../utils/google_maps');

exports.discover = async (req, res, next) => {
    try {
        const types = ['police', 'fire_station', 'hospital'];
        const client = await GMaps.getClient();
        const result = await Promise.map(types, type => client.placesNearby({ location: '-6.187823, 106.847826', radius: 1500, type })
            .asPromise()
            .then(({ json: { results: places } }) => places.map(item => item.name)));

        return httpResponse(res, 'success', 200, result);
    } catch (err) {
        return next(exception('an error occured', 500, err.message));
    }
};

module.exports = exports;
