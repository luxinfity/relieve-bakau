exports.create = (data, type) => ({
    google_place_id: data.place_id,
    name: data.name,
    type,
    address: data.formatted_address,
    phone: data.international_phone_number.replace(/\s|-/g, ''),
    geograph: {
        type: 'Point',
        coordinates: [
            data.geometry.location.lng, data.geometry.location.lat
        ]
    }
});

module.exports = exports;
