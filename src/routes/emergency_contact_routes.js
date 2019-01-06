const router = require('express').Router();
const EmergencyContactController = require('../controllers/emergency_contact_controller');
const EmergencyContactRequest = require('../middlewares/request-validator/emergency_contact_request');

router.get('/discover', EmergencyContactController.discover);
router.get('/discover/:id', EmergencyContactController.discoverDetail);
router.post('/nearby', EmergencyContactRequest('nearby'), EmergencyContactController.nearby);

module.exports = router;
