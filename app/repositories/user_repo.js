const User = require('../models/mongodb/user');

exports.findAll = conditions => User.findAll(conditions);

exports.findOne = conditions => User.findOne(conditions);

exports.create = data => User.create(data);

exports.update = (condition, data) => User.update(condition, data);

module.exports = exports;
