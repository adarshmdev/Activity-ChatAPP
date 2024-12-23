const db = require('../config/db');

const createActivity = async (activityData) => {
  const { title, description, images, userId } = activityData;
  const query = 'INSERT INTO activities (title, description, images, created_by) VALUES (?, ?, ?, ?)';
  return db.execute(query, [title, description, JSON.stringify(images), userId]);
};

const getAllActivities = async () => {
  const query = `
    SELECT a.*, u.name as creator_name, 
    (SELECT COUNT(*) FROM activity_participants WHERE activity_id = a.id) as participant_count 
    FROM activities a 
    JOIN users u ON a.created_by = u.id 
    ORDER BY a.created_at DESC
  `;
  return db.execute(query);
};

const getActivityById = async (id) => {
  const query = 'SELECT * FROM activities WHERE id = ?';
  return db.execute(query, [id]);
};

const joinActivity = async (activityId, userId) => {
  try {
    const query = 'INSERT INTO activity_participants (activity_id, user_id) VALUES (?, ?)';
    await db.execute(query, [activityId, userId]);
    return { message: 'Successfully joined the activity' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { message: 'You have already joined this activity', alreadyJoined: true };
    }
    throw err; 
  }
};

const leaveActivity = async (activityId, userId) => {
  const query = 'DELETE FROM activity_participants WHERE activity_id = ? AND user_id = ?';
  return db.execute(query, [activityId, userId]);
};


const getParticipants = async (activityId) => {
  const query = `
    SELECT u.id, u.name, u.email 
    FROM activity_participants ap 
    JOIN users u ON ap.user_id = u.id 
    WHERE ap.activity_id = ?
  `;
  return db.execute(query, [activityId]);
};

module.exports = {
  createActivity,
  getAllActivities,
  getActivityById,
  joinActivity,
  getParticipants,
  leaveActivity
};
