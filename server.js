import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';


// -> initialize express and io
const app = express();
const server = createServer(app);
const io = new Server(server);

// -> define public folder for loading assets
app.use(express.static("public"));

// -> serve app on home
app.get('/', (req, res) => {
    res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

// -> 2. listen if connected and chat message sent
io.on('connection', async (socket) => {
    socket.on('send_chat', async (msg) => {
        // -> 3. send event back to frontend
        io.emit('display_chat', msg);
    });
});


// -> starting server
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
