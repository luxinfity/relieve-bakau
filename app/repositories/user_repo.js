const Mongo = require('../utils/mongodb');

const collection = 'users';

const RELATIONSHIP = {
    FCM_TOKEN: {
        from: 'fcm_tokens',
        localField: 'uuid',
        foreignField: 'user_id',
        as: 'messaging_token'
    }
};

exports.findOne = async (conditions) => {
    const mongoClient = await Mongo.getInstance();
    return mongoClient.collection(collection).findOne(conditions);
};

exports.findById = async (uuid) => {
    const mongoClient = await Mongo.getInstance();
    return mongoClient.collection(collection).findOne({ uuid });
};

exports.create = async (datas) => {
    const mongoClient = await Mongo.getInstance();
    return mongoClient.collection(collection).insertOne(datas).then(res => res.ops[0]);
};

exports.update = async (conditions, data) => {
    const mongoClient = await Mongo.getInstance();
    return mongoClient.collection(collection).update(conditions, { $set: data });
};

exports.findOneWithRelation = async (conditions, relation) => {
    const mongoClient = await Mongo.getInstance();
    return mongoClient.collection(collection).aggregate([
        { $lookup: RELATIONSHIP[relation] },
        { $match: conditions }
    ]).toArray().then(res => (res.length === 0 ? null : res[0]));
};

module.exports = exports;
