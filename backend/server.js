const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { init } = require('./config/socket');
const cookieParser = require('cookie-parser');


const app = express();
const server = http.createServer(app);

init(server);

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/user', require('./routes/authRoutes')); 
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

const { handleChatSocket } = require('./controllers/chatController');
const io = require('./config/socket').getIO();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  handleChatSocket(socket);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});