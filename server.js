import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';


// -> initialize app and socket.io
const app = express();
const server = createServer(app);
const io = new Server(server);

// -> define public folder for loading assets
app.use(express.static("public"));

// -> serve app on home
app.get('/', (req, res) => {
    res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

// -> handle on stuff happening when client connected
io.on('connection', async (socket) => {
    socket.on('send_chat', async (msg) => {
        io.emit('display_chat', msg);
    });
});


// -> starting server
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
