const { saveMessage, getAllMessages } = require('../models/chatModel');
const io = require('../config/socket').getIO();

const getChatMessages = (req, res) => {
  getAllMessages((err, results) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    res.json(results);
  });
};

const handleChatSocket = (socket) => {
  socket.on('newMessage', (data) => {
    const { userId, message } = data;

    saveMessage({ userId, message }, (err) => {
      if (err) console.error(err);

      // Emit the message to all clients
      io.emit('message', { userId, message });
    });
  });
};

module.exports = { getChatMessages, handleChatSocket };
