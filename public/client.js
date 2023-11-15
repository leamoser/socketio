// -> initialize socket
const socket = io();

// -> load dom elements
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// -> 1. handle if message sent
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('send_chat', input.value);
        input.value = '';
    }
});

// -> 4. listen if message processed by backend
socket.on('display_chat', (msg) => {
    const item = document.createElement('li');
    item.innerText = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
