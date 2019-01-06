const router = require('express').Router();
const AddressController = require('../controllers/address_controller');
const AddressRequest = require('../middlewares/request-validator/address_request');

router.post('/', AddressRequest('create'), AddressController.create);
router.get('/', AddressController.list);
router.get('/:id', AddressController.detail);


module.exports = router;
