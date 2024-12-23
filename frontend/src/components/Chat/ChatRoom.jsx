
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, addMessage } from '../../store/slices/chatSlice';
import { io } from 'socket.io-client';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user, loading } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

console.log("messages",messages)
  useEffect(() => {
    if (!loading && user) {
       dispatch(fetchMessages()); 
    }
    if (!user || loading || socketRef.current) return;

    console.log('Initializing socket connection...');
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('chat-message', (message) => {
      dispatch(addMessage(message));
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, loading, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current && isConnected && user) {
      const messageData = {
        text: newMessage.trim()
      };
  
      socketRef.current.emit('send-message', messageData);
      setNewMessage('');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

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
                msg.userName === user.name ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              }`}
              style={{ maxWidth: '70%' }}
            >
              <div className="font-bold text-sm">{msg.userName}</div>
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