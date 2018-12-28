exports.create = (request) => {
    const coordinates = request.body.coordinates.split(',').map(item => +item.trim());
    return {
        user_id: request.auth.uid,
        geograph: {
            type: 'Point',
            coordinates
        },
        status: +request.body.status
    };
};

module.exports = exports;
