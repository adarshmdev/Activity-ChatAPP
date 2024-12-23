const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { 
  createActivity, 
  getAllActivities, 
  joinActivity, 
  getParticipants,
  getActivityById 
} = require('../models/activityModel');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/images';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

const createNewActivity = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const images = req.files ? req.files.map(file => file.filename) : [];
    
    const [result] = await createActivity({ title, description, images, userId });
    
    const [newActivity] = await getActivityById(result.insertId);
    
    res.status(201).json({
      message: 'Activity created successfully',
      activity: newActivity[0]
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getActivities = async (req, res) => {
  try {
    const [activities] = await getAllActivities();
    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const joinAnActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id; 

    const result = await joinActivity(activityId, userId);
console.log("result", result)
    if (result.alreadyJoined) {
      return res.status(200).json({ message: result.message });
    }

    res.status(201).json({ message: result.message });
  } catch (err) {
    console.error('Error joining activity:', err);
    res.status(500).json({ message: 'An error occurred while joining the activity' });
  }
};

const leaveAnActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id; 

    const result = await leaveActivity(activityId, userId);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'You have not joined this activity' });
    }

    res.status(200).json({ message: 'Successfully left the activity' });
  } catch (err) {
    console.error('Error leaving activity:', err);
    res.status(500).json({ message: 'An error occurred while leaving the activity' });
  }
};


const getActivityParticipants = async (req, res) => {
  try {
    const { activityId } = req.params;
    const [participants] = await getParticipants(activityId);
    res.json(participants);
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createNewActivity,
  getActivities,
  joinAnActivity,
  getActivityParticipants,
  leaveAnActivity,
  upload
};