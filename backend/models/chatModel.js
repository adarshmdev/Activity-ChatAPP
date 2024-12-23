
const pool = require('../config/db');

const saveMessage = async (messageData) => {
  try {
    const timestamp = new Date(messageData.timestamp)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const [result] = await pool.execute(
      'INSERT INTO messages (user_id, user_name, message_text, timestamp) VALUES (?, ?, ?, ?)',
      [
        messageData.userId,
        messageData.userName || 'Anonymous',
        messageData.text,
        timestamp
      ]
    );

    return result;
  } catch (error) {
    console.error('Database error saving message:', error);
    throw new Error(`Failed to save message: ${error.message}`);
  }
};

const getAllMessages = async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM messages ORDER BY timestamp ASC'
    );
    
    return rows.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp).toISOString()
    }));
  } catch (error) {
    console.error('Database error fetching messages:', error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
};

module.exports = {
  saveMessage,
  getAllMessages
};