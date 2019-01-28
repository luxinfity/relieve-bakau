const { GEOLOCATION_ATTRIBUTES: GEOATTR } = require('../../utils/constant');

exports.create = ({ body, auth }, address) => {
    const [lat, lng] = body.coordinates.split(',').map(item => +item.trim());
    const details = {};

    if (address) {
        address.forEach((key) => {
            key.types.forEach((type) => {
                if (GEOATTR[type]) {
                    details[GEOATTR[type].name] = key.long_name;
                }
            });
        });
    }

    return {
        name: body.name,
        user_id: auth.uid,
        details,
        geograph: {
            type: 'Point',
            coordinates: [lng, lat]
        }
    };
};

exports.list = addresses => addresses.map((item) => {
    const [lng, lat] = item.geograph.coordinates;
    return ({
        uuid: item.uuid,
        name: item.name,
        details: item.details,
        coordinates: `${lat}, ${lng}`
    });
});

exports.detail = (address) => {
    const [lng, lat] = address.geograph.coordinates;
    return {
        name: address.name,
        coordinates: `${lat}, ${lng}`,
        details: address.details,
        emergency_contacts: address.emergency_contacts.map(item => ({
            name: item.name,
            type: item.type,
            phone: item.phone
        }))
    };
};

module.exports = exports;
