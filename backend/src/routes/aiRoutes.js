const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.use(auth); // Protect route

router.post('/insights', aiController.generateInsights);
router.post('/chat', aiController.chat);

module.exports = router;
