exports.create = ({ body, auth }) => {
    const coordinates = body.coordinates.split(',').map(item => +item.trim());
    return {
        name: body.name,
        user_id: auth.uid,
        geograph: {
            type: 'Point',
            coordinates
        }
    };
};

exports.list = addresses => addresses.map(item => ({
    uuid: item.uuid,
    name: item.name,
    coordinates: item.geograph.coordinates.join(',')
}));

exports.detail = address => ({
    name: address.name,
    coordinates: address.geograph.coordinates.join(),
    emergency_contacts: address.emergency_contacts.map(item => ({
        name: item.name,
        type: item.type,
        phone: item.phone
    }))
});

module.exports = exports;
