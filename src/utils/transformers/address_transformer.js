const { GEOLOCATION_ATTRIBUTES: GEOATTR } = require('../../utils/constant');

exports.address_components = (address) => {
    if (!address) return null;
    const details = {};
    address.forEach((key) => {
        key.types.forEach((type) => {
            if (GEOATTR[type]) {
                details[GEOATTR[type].name] = key.long_name;
            }
        });
    });
    return details;
};

exports.create = ({ data, user_id: userId }, address) => {
    const [lat, lng] = data.coordinates.split(',').map(item => +item.trim());
    const details = exports.address_components(address);
    return {
        name: data.name,
        user_id: userId,
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
        id: item.id,
        name: item.name,
        details: item.details,
        coordinates: `${lat}, ${lng}`
    });
});

exports.detail = (address) => {
    const [lng, lat] = address.geograph.coordinates;
    return {
        name: address.name,
        coordinates: `${lat},${lng}`,
        details: address.details,
        emergency_contacts: address.emergency_contacts.map(item => ({
            name: item.name,
            type: item.type,
            phone: item.phone
        }))
    };
};

module.exports = exports;
