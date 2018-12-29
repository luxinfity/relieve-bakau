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

module.exports = exports;
