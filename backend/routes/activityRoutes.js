const express = require('express');
const { createNewActivity, getActivities, joinAnActivity, getActivityParticipants, upload } = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for activities
router.get('/', getActivities);
router.post('/create', authMiddleware, upload.array('images', 3), createNewActivity);
router.post('/:activityId/join', authMiddleware, joinAnActivity);
router.get('/:activityId/participants', authMiddleware, getActivityParticipants);

module.exports = router;
