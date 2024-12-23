import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setMessages } from '../../redux/chatSlice';
import { io } from 'socket.io-client';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('chat-message', (message) => {
      dispatch(addMessage(message));
    });

    // Fetch initial chat history
    newSocket.on('chat-history', (history) => {
      dispatch(setMessages(history));
    });

    return () => newSocket.disconnect();
  }, [dispatch]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = { user: user.name, text: newMessage };
      socket.emit('send-message', message);
      setNewMessage('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Chat Room</h1>
      <div className="border p-4 h-96 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 ml-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
