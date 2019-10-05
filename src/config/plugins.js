'use strict';

module.exports = {
    maps: {
        key: process.env.GMAPS_APIKEY
    },
    firebase: {
        databaseURL: process.env.FB_DB_URL,
        credentialPath: process.env.FB_CERT_PATH
    }
};
