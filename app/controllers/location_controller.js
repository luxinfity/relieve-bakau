const { apiResponse, exception } = require('../utils/helpers');
const Location = require('../repositories/location_history_repo');

exports.latest = async (req, res, next) => {
    try {
        const latestLocations = await Location.getAllLatest();
        return apiResponse(res, 'latest location data retrieved', 200, latestLocations);
    } catch (err) {
        return next(exception('an error occured', 500, err.message));
    }
};

module.exports = exports;
