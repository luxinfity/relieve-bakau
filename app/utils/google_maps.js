const GMAPS = require('@google/maps');

let client;

exports.initialize = () => {
    console.log(`initialize gmaps ${process.env.GMAPS_APIKEY}`);
    client = GMAPS.createClient({
        key: process.env.GMAPS_APIKEY,
        Promise
    });
};

exports.getClient = () => {
    if (!client) exports.initialize();
    console.log('getting gmaps client');
    return client;
};

module.exports = exports;
