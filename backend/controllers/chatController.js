const { saveMessage, getAllMessages } = require('../models/chatModel');
const io = require('../config/socket').getIO();

const getChatMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages',
      error: error.message 
    });
  }
};


const handleChatSocket = (socket) => {
  const user = socket.user;
  console.log("sock user", user)
  socket.on('send-message', async (messageData) => {
    try {
      const message = {
        userId: user.id,
        userName: user.name || 'Anonymous',
        text: messageData.text,
        timestamp: new Date().toISOString() 
      };
      
      await saveMessage(message);
      
      const broadcastMessage = {
        ...message,
        timestamp: new Date(message.timestamp).toISOString()
      };
      
      io.emit('chat-message', broadcastMessage);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
};

module.exports = { getChatMessages, handleChatSocket };