const Mongo = require('../utils/mongodb');

const collection = 'refresh_tokens';

exports.findOne = async (conditions) => {
    const mongoClient = await Mongo.getInstance();
    return mongoClient.collection(collection).findOne(conditions);
};

exports.createOrUpdate = async (conditions, data) => {
    const mongoClient = await Mongo.getInstance();
    return mongoClient.collection(collection).updateOne(conditions, { $set: data }, { upsert: true });
};

module.exports = exports;
