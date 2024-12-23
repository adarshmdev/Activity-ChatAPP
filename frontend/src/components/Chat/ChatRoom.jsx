import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setMessages } from '../../redux/chatSlice';
import { io } from 'socket.io-client';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('chat-message', (message) => {
      dispatch(addMessage(message));
    });

    newSocket.on('chat-history', (history) => {
      dispatch(setMessages(history));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && isConnected) {
      const message = {
        user: user.name,
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      socket.emit('send-message', message);
      setNewMessage('');
    }
  };

  if (!user) {
    return <div className="p-4">Please login to access the chat room.</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
      <div className="border rounded-lg p-4 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.user === user.name ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              }`}
              style={{ maxWidth: '70%' }}
            >
              <div className="font-bold text-sm">{msg.user}</div>
              <div>{msg.text}</div>
              <div className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded p-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!isConnected}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
      {!isConnected && (
        <div className="text-red-500 mt-2">Disconnected from chat server</div>
      )}
    </div>
  );
};

export default ChatRoom;