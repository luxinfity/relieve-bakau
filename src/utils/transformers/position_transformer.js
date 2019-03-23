exports.create = (data, context) => {
    const [lat, lng] = data.body.coordinates.split(',').map(item => +item.trim());
    return {
        user_id: context.id,
        geograph: {
            type: 'Point',
            coordinates: [lng, lat]
        },
        status: +data.body.status,
        is_latest: true
    };
};

module.exports = exports;
