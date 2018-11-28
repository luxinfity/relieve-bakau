const MongoContext = require('../models/mongodb');

const collection = 'users';

exports.findOne = async (conditions) => {
    const mongoClient = await MongoContext.getInstance();
    return mongoClient.collection(collection).findOne(conditions);
};

exports.findById = async (uuid) => {
    const mongoClient = await MongoContext.getInstance();
    return mongoClient.collection(collection).findOne({ uuid });
};

exports.create = async (datas) => {
    const mongoClient = await MongoContext.getInstance();
    return mongoClient.collection(collection).insertOne(datas).then(res => res.ops[0]);
};

exports.update = async (conditions, data) => {
    const mongoClient = await MongoContext.getInstance();
    return mongoClient.collection(collection).update(conditions, { $set: data });
};

module.exports = exports;
