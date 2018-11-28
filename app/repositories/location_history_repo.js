const MongoContext = require('../models/mongodb');

const collection = 'location_histories';

exports.findOne = async (conditions) => {
    const mongoClient = await MongoContext.getInstance();
    return mongoClient.collection(collection).findOne(conditions);
};

exports.create = async (datas) => {
    const mongoClient = await MongoContext.getInstance();
    return mongoClient.collection(collection).insertOne(datas);
};

module.exports = exports;
