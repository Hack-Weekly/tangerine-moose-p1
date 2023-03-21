//npx nodemon server.ts -to run server
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors:{origin:"*"}});
const PORT = 3000 || process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected!');

  // Handle incoming messages from the client
  socket.on('send_message', (data) => {
    console.log(`Received message: ${data.message}`);
    socket.to(data.recipient).emit("recieve_message", data)
  });

  socket.on("select_recipient", (recipient) => {
    socket.leave(recipient.old)
    socket.join(recipient.new);
    console.log(`User with ID: ${socket.id} selected recipient id: ${recipient}`);
  });

  // Handle disconnection events
  socket.on('disconnect', () => {
    console.log('A user disconnected!');
  });
});

server.listen(PORT, () => {
  console.log('Server listening on port 3000');
});