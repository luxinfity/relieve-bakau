const mongoose = require('mongoose');

exports.initialize = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true });
};

module.exports = exports;
