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
        socket.emit('send_chat', input.value, username);
        input.value = '';
    }
});

// -> create function to play sound on incoming message
const playSound = (incoming_username) => {
    console.log(incoming_username, username)
    if (incoming_username === username) return;
    const chime = new Audio('chime.mp3');
    chime.play();
}

// -> do something on incoming chat message
socket.on('broadcast_chat', (msg, username, serverOffset) => {
    const item = document.createElement('li');
    item.innerHTML = `<span class="name">${username}</span>${msg}`;
    messages.appendChild(item);
    playSound(username);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
});

