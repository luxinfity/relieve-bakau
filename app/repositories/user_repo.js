const User = require('../models/mongodb/user');

exports.findOne = conditions => User.findOne(conditions);

exports.findAll = conditions => User.findAll(conditions);

exports.create = data => User.create(data);

module.exports = exports;
