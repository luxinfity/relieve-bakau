exports.FAMILIY_REQUEST_STATUS = {
    WAITING_VERIFICATION: 10,
    VERIFIED: 20
};

exports.FAMILIY_CONDITION_STATUS = {
    NO_CONDIITION: 10,
    OKAY: 20,
    NOT_OKAY: 30
};

exports.EMERGENCY_CONTACT_TYPES = ['police', 'fire_station', 'hospital'];

exports.GEOLOCATION_ATTRIBUTES = {
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
    },
    route: {
        name: 'street'
    }
};

exports.MODELS_PATH = {
    SQL: 'src/models/sequelize',
    MONGO: 'src/models/mongodb',
    JOB: 'src/jobs'
};

exports.FAMILIY_LIMIT = 5;

exports.MESSAGING_TEMPLATE = {
    NEW_FAMILIY_REQUEST: { title: 'Family Request', body: 'theres a new family request' },
    FAMILY_PING: { title: 'Family Ping', body: 'a family wants to know your condition' }
};

exports.REDIRECT_ACTIONS = {
    NONE: 'none',
    COMPLETE_REGISTRATION: 'complete-registration'
};

module.exports = exports;
