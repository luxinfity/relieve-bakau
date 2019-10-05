'use strict';

module.exports = {
    maps: {
        key: process.env.GMAPS_APIKEY
    },
    firebase: {
        databaseURL: process.env.FIREBASE_DB_URL,
        credentialPath: process.env.FIREBASE_CERT_PATH
    }
};
