const multer = require('multer');
const { createActivity, getAllActivities, joinActivity, getParticipants } = require('../models/activityModel');

const upload = multer({ dest: 'uploads/images/' });

const createNewActivity = (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id; // Retrieved from middleware after authentication
  const images = req.files.map((file) => file.filename);

  createActivity({ title, description, images, userId }, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    res.status(201).json({ message: 'Activity created', activityId: result.insertId });
  });
};

const getActivities = (req, res) => {
  getAllActivities((err, results) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    res.json(results);
  });
};

const joinAnActivity = (req, res) => {
  const { activityId } = req.params;
  const userId = req.user.id;

  joinActivity(activityId, userId, (err) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    res.json({ message: 'Successfully joined activity' });
  });
};

const getActivityParticipants = (req, res) => {
  const { activityId } = req.params;

  getParticipants(activityId, (err, results) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    res.json(results);
  });
};

module.exports = { createNewActivity, getActivities, joinAnActivity, getActivityParticipants, upload };
