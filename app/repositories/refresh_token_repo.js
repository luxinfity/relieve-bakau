const RefreshToken = require('../models/mongodb/refresh_token');

exports.createOrUpdate = data => RefreshToken.update({ userId: data.userId }, data, { upsert: true });

exports.findOne = data => RefreshToken.findOne(data);

module.exports = exports;
