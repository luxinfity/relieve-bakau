const mongoose = require('mongoose');

exports.initialize = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(`${process.env.MONGO_CONNECTION}/${process.env.MONGO_DB}`, { useNewUrlParser: true });
};

module.exports = exports;
