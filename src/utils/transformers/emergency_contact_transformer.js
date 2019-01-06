exports.createFromPlace = (place, address) => ({
    address_id: address.uuid,
    name: place.name,
    type: place.type,
    phone: place.phone
});

exports.createNew = (place, type, address) => ({
    address_id: address.uuid,
    name: place.name,
    type,
    phone: place.international_phone_number.replace(/\s|-/g, '')
});

exports.show = data => ({
    name: data.name,
    type: data.type,
    phone: data.phone
});

module.exports = exports;
