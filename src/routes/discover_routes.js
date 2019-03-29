'use strict';

const router = require('express').Router();
const Validator = require('../middlewares/request_validator');

const {
    places, placesDetail, nearbyContacts, addressDetail
} = require('../methods/discovers');
const { ExpressLogicAdapter: Logic } = require('../utils/libs/express');

router.post('/places', Logic(places));
router.post('/places/:id', Logic(placesDetail));

router.get('/nearby-contacts', Validator('nearby'), Logic(nearbyContacts));
router.get('/address-detail', Validator('address'), Logic(addressDetail));

module.exports = router;
