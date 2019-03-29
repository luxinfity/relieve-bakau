'use strict';

module.exports = {
    maps: {
        key: process.env.GMAPS_APIKEY
    },
    firebase: {
        databaseURL: process.env.FIREBASE_DB_URL,
        credential: require('../../storage/firebase-service-account.json')
    }
};
