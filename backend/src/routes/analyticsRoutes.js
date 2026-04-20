const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/stats', analyticsController.getStats);
router.get('/weekly', analyticsController.getWeeklyActivity);
router.get('/deadlines', analyticsController.getDeadlineAlerts);
router.get('/streak', analyticsController.getStreakData);
router.get('/insights', analyticsController.getAIInsights);

module.exports = router;
