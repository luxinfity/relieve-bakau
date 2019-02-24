const router = require('express').Router();
const EmergencyContactController = require('../controllers/emergency_contact_controller');
const EmergencyContactRequest = require('../middlewares/request-validator/emergency_contact_request');

router.post('/discover', EmergencyContactController.discover);
router.post('/discover/:id', EmergencyContactController.discoverDetail);
router.get('/nearby', EmergencyContactRequest('nearby'), EmergencyContactController.nearby);

module.exports = router;
