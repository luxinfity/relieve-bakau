const { OAuth2Client } = require('google-auth-library');

let client;

exports.initialize = () => {
    client = new OAuth2Client(process.env.FIREBASE_CLIENT_ID);
};

exports.getClient = () => {
    if (!client) exports.initialize();
    return client;
};

module.exports = exports;
