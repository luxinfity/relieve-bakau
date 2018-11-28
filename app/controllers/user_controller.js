const bcrypt = require('bcryptjs');
const moment = require('moment');
const Promise = require('bluebird');
const { apiResponse, exception } = require('../utils/helpers');
const UserRepo = require('../repositories/user_repo');
const Location = require('../repositories/location_history_repo');
const GMaps = require('../utils/google_maps');

exports.profile = async (req, res, next) => {
    try {
        const user = await UserRepo.findOne({ _id: req.user.id });
        const response = {
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            phone: user.phone,
            birthdate: user.birthdate,
            isComplete: user.isComplete
        };
        return apiResponse(res, 'successfully retrieved profile data', 200, response);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.completeRegister = async (req, res, next) => {
    try {
        const user = await UserRepo.findOne({ _id: req.user.id, isComplete: false });
        if (!user) return next(exception('profile already completed', 403));

        const payload = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 8),
            birthdate: moment(req.body.birthdate).format('YYYY-MM-DD'),
            isComplete: true
        };
        await UserRepo.update({ _id: req.user.id }, payload);

        return apiResponse(res, 'complete register successfull', 200);
    } catch (err) {
        return next(exception(err.message));
    }
};

exports.discover = async (req, res, next) => {
    try {
        const types = ['police', 'fire_station', 'hospital'];
        const client = await GMaps.getClient();
        const result = await Promise.map(types, type => client.placesNearby({ location: '-6.187823, 106.847826', radius: 1500, type })
            .asPromise()
            .then(({ json: { results: places } }) => places.map(item => item.name)));

        return apiResponse(res, 'success', 200, result);
    } catch (err) {
        return next(exception('an error occured', 500, err.message));
    }
};

exports.updateLocation = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            userId: req.user.id
        };
        await Location.create(payload);
        return apiResponse(res, 'location and status updated', 201, payload);
    } catch (err) {
        return next(exception('an error occured', 500, err.message));
    }
};

module.exports = exports;
