const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio= new Audio('ting.mp3')
// Function to append messages to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message; // Set the message text
    messageElement.classList.add('message', position); // Add dynamic class
   messageContainer.append(messageElement); // Append to the container
   if(position =='left'){
    audio.play();
   }
  
};

// Prompt user for their name and send it to the server
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Listen for events when a new user joins
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'left');
});

// Listen for incoming messages
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Listen for the 'user-left' event
socket.on('user-left', (name) => {
    append(`${name} left the chat`, 'left');
});

// Send messages
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    const message = messageInput.value;
    append(`You: ${message}`, 'right'); // Show the message on sender's screen
    socket.emit('send', message); // Send the message to the server
    messageInput.value = ''; // Clear the input field after sending
});
