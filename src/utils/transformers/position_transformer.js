exports.create = (request) => {
    const [lat, lng] = request.body.coordinates.split(',').map(item => +item.trim());
    return {
        user_id: request.auth.uid,
        geograph: {
            type: 'Point',
            coordinates: [lng, lat]
        },
        status: +request.body.status,
        is_latest: true
    };
};

module.exports = exports;
