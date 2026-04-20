const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/reminders/auto', applicationController.runReminderEngine);
router.post('/', applicationController.createApplication);
router.get('/', applicationController.getApplications);
router.put('/:id', applicationController.updateApplication);
router.put('/:id/status', applicationController.updateApplicationStatus);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
