const express = require('express');
const http = require('http');
const cors = require('cors');
const { init } = require('./config/socket');

const app = express();
const server = http.createServer(app);
init(server); // Initialize socket.io

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Server listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io chat handling
const { handleChatSocket } = require('./controllers/chatController');
const io = require('./config/socket').getIO();

io.on('connection', (socket) => {
  console.log('User connected');
  handleChatSocket(socket);
});
