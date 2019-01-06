const router = require('express').Router();
const FamilyController = require('../controllers/family_controller');
const FamilyRequest = require('../middlewares/request-validator/family_request');

router.get('/', FamilyController.list);
router.post('/request', FamilyRequest('createRequest'), FamilyController.createRequest);
router.post('/request/verify', FamilyRequest('verifyRequest'), FamilyController.verifyRequest);
router.put('/:uuid/update', FamilyRequest('update'), FamilyController.update);

module.exports = router;
