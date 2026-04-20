const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', resumeController.getResumes);
router.post('/', resumeController.createResume);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
