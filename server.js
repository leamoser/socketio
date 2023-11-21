import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// -> open database file
const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
});

// -> create table if not existent
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      username TEXT
  );
`);

// -> initialize app and socket.io
const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

// -> define public folder for loading assets
app.use(express.static("public"));

// -> serve app on home
app.get('/', (req, res) => {
    res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

// -> handle on stuff happening when client connected
io.on('connection', async (socket) => {

    // -> send messages
    socket.on('send_chat', async (msg, username) => {
        let result;
        try {
            result = await db.run('INSERT INTO messages (content, username) VALUES (?, ?)', msg, username);
        } catch (e) {
            console.error('error on inserting message into database', e)
            return;
        }
        io.emit('broadcast_chat', msg, username, result.lastID);
    });

    // -> load passed messages
    if (!socket.recovered) {
        try {
            await db.each('SELECT id, content, username FROM messages WHERE id > ?',
                [socket.handshake.auth.serverOffset || 0],
                (_err, row) => {
                    socket.emit('broadcast_chat', row.content, row.username, row.id);
                }
            )
        } catch (e) {
            console.error('error on reading old messages from database', e)
        }
    }

    // -> handle disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


// -> starting server
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
