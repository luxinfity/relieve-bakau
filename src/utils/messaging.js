'use strict';

const { Firebase } = require('relieve-common');

const options = {};

exports.sendToDevice = async (tokens, { data, notification }) => {
    const instance = await Firebase.getInstance();
    return instance.messaging().sendToDevice(tokens, { data, notification }, options);
};

exports.sendToTopic = () => ({});
exports.sendToGroup = () => ({});
exports.subscribeTopic = () => ({});
exports.unSubscribeTopic = () => ({});

module.exports = exports;
