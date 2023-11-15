// -> handle offset
const socket = io({
    auth: {
        serverOffset: 0
    }
});

// -> load dom elements
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const username = prompt('Enter username', '');

// -> handle sending message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value, username);
        input.value = '';
    }
});

// -> do something on incoming chat message
socket.on('chat message', (msg, username, serverOffset) => {
    const item = document.createElement('li');
    item.innerHTML = `<span class="name">${username}</span>${msg}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
});
