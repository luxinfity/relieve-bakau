const router = require('express').Router();
const AddressController = require('../controllers/address_controller');
const AddressRequest = require('../middlewares/request-validator/address_request');

router.get('/', AddressController.list);
router.post('/', AddressRequest('create'), AddressController.create);

module.exports = router;
