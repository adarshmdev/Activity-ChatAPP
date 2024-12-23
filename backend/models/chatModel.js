const db = require('../config/db');

const saveMessage = (messageData, callback) => {
  const { userId, message } = messageData;
  db.query(
    'INSERT INTO chats (user_id, message) VALUES (?, ?)',
    [userId, message],
    callback
  );
};

const getAllMessages = (callback) => {
  db.query(
    `SELECT c.message, u.name FROM chats c 
    JOIN users u ON c.user_id = u.id ORDER BY c.created_at ASC`,
    callback
  );
};

module.exports = { saveMessage, getAllMessages };
