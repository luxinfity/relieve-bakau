'use strict';

const mongodb = require('mongodb');

let instance = null;

const createNewConnection = () => mongodb.MongoClient.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true });

exports.initialize = async () => {
    if (!instance) {
        instance = await createNewConnection();
    } else {
        console.log('already initialized'); // eslint-disable-line
    }
};

exports.getInstance = async (db = process.env.MONGO_DB) => {
    if (!instance) await exports.initialize();
    return instance.db(db);
};

exports.close = async () => {
    if (instance) {
        await instance.close();
        instance = null;
    }
};

module.exports = exports;
