const express = require('express');
const { createNewActivity, getActivities, joinAnActivity, getActivityParticipants, upload } = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');
const { leaveActivity } = require('../models/activityModel');

const router = express.Router();

router.get('/', authMiddleware, getActivities);
router.post('/create', authMiddleware, upload.array('images', 3), createNewActivity);
router.post('/:activityId/join', authMiddleware, joinAnActivity);
router.get('/:activityId/participants', authMiddleware, getActivityParticipants);
router.post('/:activityId/leave', authMiddleware,leaveActivity);

module.exports = router;
