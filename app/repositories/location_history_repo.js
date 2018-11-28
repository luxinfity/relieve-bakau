const LocationHistory = require('../models/mongodb/location_history');

exports.findOne = data => LocationHistory.findOne(data);

exports.findAll = data => LocationHistory.find(data);

exports.create = data => LocationHistory.create(data);

module.exports = exports;
