// Import and configure the Socket.IO server
const io = require('socket.io')(8000, {
    cors: {
        origin: '*', // Allow connections from any origin for cross-origin requests
    },
});

// Object to store connected users and their associated socket IDs
const users = {};

// Handle connection events
io.on('connection', (socket) => {
    // When a new user joins
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name; // Map the user's socket ID to their name
        socket.broadcast.emit('user-joined', name); // Notify all other users that a new user has joined
        console.log(`${name} joined the chat`); // Log the event to the server console
    });

    // When a user sends a message
    socket.on('send', (message) => {
        const name = users[socket.id]; // Retrieve the name of the user who sent the message
        socket.broadcast.emit('receive', { message, name }); // Broadcast the message and sender's name to all other users
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        const name = users[socket.id]; // Get the name of the disconnected user
        if (name) {
            socket.broadcast.emit('user-left', name); // Notify all other users that the user has left
            delete users[socket.id]; // Remove the user from the `users` object
            console.log(`${name} left the chat`); // Log the event to the server console
        }
    });
});
