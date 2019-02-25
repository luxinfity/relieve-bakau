exports.HttpResponse = (res, message, content = null, status = 200) => res.status(status).json({
    message,
    status,
    content
});

exports.requestInput = req => ({
    query: req.query || null,
    params: req.params || null,
    body: req.body || null
});

exports.splitCoordinates = (coordinates) => {
    const [lat, lng] = coordinates.split(',').map(item => +item.trim());
    return {
        lat, lng
    };
};

module.exports = exports;
