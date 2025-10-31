const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.get('/', (req, res) => res.send('Socket.io Chat Server'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend origin
    methods: ["GET", "POST"]
  }
});

// Keep track of connected users (optional)
const users = new Map(); // socket.id -> username

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a user sets their name (join)
  socket.on('join', (username) => {
    users.set(socket.id, username);
    socket.broadcast.emit('system message', `${username} joined the chat`);
    // send current user list to all
    io.emit('users', Array.from(users.values()));
  });

  // When a client sends a chat message
  socket.on('chat message', (payload) => {
    // payload: { username, message, time }
    io.emit('chat message', payload); // broadcast to all including sender
  });

  // Disconnect event
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      socket.broadcast.emit('system message', `${username} left the chat`);
      io.emit('users', Array.from(users.values()));
    }
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});
