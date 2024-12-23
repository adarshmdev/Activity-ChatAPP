const db = require('../config/db');

const createActivity = (activityData, callback) => {
  const { title, description, images, userId } = activityData;
  db.query(
    'INSERT INTO activities (title, description, images, created_by) VALUES (?, ?, ?, ?)',
    [title, description, JSON.stringify(images), userId],
    callback
  );
};

const getAllActivities = (callback) => {
  db.query('SELECT * FROM activities', callback);
};

const getActivityById = (id, callback) => {
  db.query('SELECT * FROM activities WHERE id = ?', [id], callback);
};

const joinActivity = (activityId, userId, callback) => {
  db.query(
    'INSERT INTO activity_participants (activity_id, user_id) VALUES (?, ?)',
    [activityId, userId],
    callback
  );
};

const getParticipants = (activityId, callback) => {
  db.query(
    `SELECT u.id, u.name FROM activity_participants ap 
    JOIN users u ON ap.user_id = u.id WHERE ap.activity_id = ?`,
    [activityId],
    callback
  );
};

module.exports = {
  createActivity,
  getAllActivities,
  getActivityById,
  joinActivity,
  getParticipants,
};
