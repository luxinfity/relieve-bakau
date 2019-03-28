'use strict';

module.exports = {
    maps: {
        key: process.env.GMAPS_APIKEY
    },
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DB_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID
    }
};
