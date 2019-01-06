exports.create = (data, type) => ({
    google_place_id: data.place_id,
    name: data.name,
    type,
    address: data.formatted_address,
    phone: data.international_phone_number.replace(/\s|-/g, ''),
    geograph: {
        coordinates: [
            data.geometry.location.lat, data.geometry.location.lng
        ]
    }
});

module.exports = exports;
