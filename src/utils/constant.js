const FAMILIY_REQUEST_STATUS = {
    WAITING_VERIFICATION: 10,
    VERIFIED: 20
};

const FAMILIY_CONDITION_STATUS = {
    NO_CONDIITION: 10,
    OKAY: 20,
    NOT_OKAY: 30
};

const EMERGENCY_CONTACT_TYPES = ['police', 'fire_station', 'hospital'];

const GEOLOCATION_ATTRIBUTES = {
    postal_code: {
        name: 'zip_code'
    },
    country: {
        name: 'country'
    },
    administrative_area_level_1: {
        name: 'area_1'
    },
    administrative_area_level_2: {
        name: 'area_2'
    },
    administrative_area_level_3: {
        name: 'area_3'
    },
    administrative_area_level_4: {
        name: 'area_4'
    }
};

module.exports = {
    FAMILIY_REQUEST_STATUS,
    FAMILIY_CONDITION_STATUS,
    EMERGENCY_CONTACT_TYPES,
    GEOLOCATION_ATTRIBUTES
};
