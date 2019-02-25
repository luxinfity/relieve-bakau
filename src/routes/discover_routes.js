const router = require('express').Router();
const DiscoverController = require('../controllers/discover_controller');
const DiscoverRequest = require('../middlewares/request-validator/discover_request');

router.post('/places', DiscoverController.places);
router.post('/places/:id', DiscoverController.placesDetail);

router.get('/nearby-contacts', DiscoverRequest('nearby'), DiscoverController.nearbyContacts);
router.get('/address-detail', DiscoverRequest('address'), DiscoverController.addressDetail);

module.exports = router;
