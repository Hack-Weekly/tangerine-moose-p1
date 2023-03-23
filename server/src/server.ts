//npx nodemon server.ts -to run server
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { User } from './interfaces/User';

type Messages = {
  [key: string]: any[]
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = 3000 || process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// users list
let users: User[] = [];

// messages list
const messages: Messages = {
  general: [],
  random: [],
  jokes: [],
}

io.of("/").adapter.on("create-room", (room) => {
  console.log(`Room: ${room} was created`);
});

io.of("/").adapter.on("delete-room", (room) => {
  console.log(`Room: ${room} was deleted`);
});

io.of("/").adapter.on("join-room", async (room, id) => {
  console.log(`User ID: ${id} has joined room ${room}`);
  try {
    const sockets = await io.in(room).fetchSockets();
    for (const socket of sockets) {
      console.log('[DEBUG] socket.id', socket.id);
      console.log('[DEBUG] socket.rooms', socket.rooms);
      console.log('[DEBUG] socket.data', socket.data);
    }
  } catch (error) {
    console.error(error)
  }
});

io.of("/").adapter.on("leave-room", async (room, id) => {
  console.log(`User ID: ${id} has left room ${room}`);
  
  const sockets = await io.in(room).fetchSockets();
  
  const usersInRoom = sockets.map(socket => {
    return {
      id: socket.id,
      username: socket.data.username,
    } as User;
  });
  
  io.to(room).emit('update_room_users', usersInRoom, room);
});
io.on('connection', (socket: Socket) => {
  console.log('Connected:', socket.id);
  // console.log(`messages:`, messages);
  // On "join server" event, push the new user to users list and emit the new users list to all clients.
  socket.on('join_server', (username: string) => {
    if (users.find(user => user.username === username)) {
      socket.emit('username_taken');
      return;
    }

    const newUser: User = {
      username: username,
      id: socket.id
    }

    users.push(newUser);
    socket.data.username = username;

    io.to(socket.id).emit('join_success', username);
    io.emit('update_users', users);
    console.log(`User ${username} joined the server!`)
    console.log(`Users list:`, users);
  });

  // On "join_room" event, join the room and execute the callback function
  socket.on('join_room', async (roomName, callback) => {
    socket.join(roomName);
    console.log(`Messages list:`, messages[roomName]);

    // return all Socket instances in the {roomName} room of the main namespace
    const sockets = await io.in(roomName).fetchSockets();

    // const sockets = await io.fetchSockets();

    const usersInRoom = sockets.map(socket => {
      return {
        id: socket.id,
        username: socket.data.username,
      } as User;
    });

    // const userObj = sockets.reduce((r, key) => {
    //   return {
    //     ...r,
    //     [key.id]: {
    //       id : key.id,
    //       username: socket.data.username,
    //     },
    //   }
    // }, {});
    console.log(`Sockets in room ${roomName}:`, usersInRoom);

    socket.to(roomName).emit('update_room_users', usersInRoom, roomName);

    callback({
      messages: messages[roomName],
      users: usersInRoom,
      // userObj: userObj,
    }); // Pass callback from client to server.
  });

  socket.on('send_message2', ({ content, to, sender, chatName, isChannel }) => {
    if (isChannel) {
      const payload = {
        content,
        chatName,
        sender,
      }
      /* "to" is assummed to be a channel name. 
      If the message is being sent to a specific channel, then the message will be sent to everyone in the channel.
      */
      socket.to(to).emit('new_message', payload);
    } else {
      const payload = {
        content,
        chatName: sender,
        sender,
      }
      /* "to" is assummed to be a socketId. 
      If the message is being sent to a specific user, then the message will be sent to only that user.
      */
      socket.to(to).emit('new_message', payload);
    }
    if (messages[chatName]) {
      messages[chatName].push({ content, sender });
    }
  });

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
    let username = '';
    const newUsers = users.filter(user => {
      if (user.id === socket.id) {
        username = user.username;
        return false;
      } else {
        return true;
      }
    });
    console.log(`${username || 'A user'} disconnected! Socket ID: ${socket.id}`);
    if (users.length !== newUsers.length) {
      users = newUsers;
      io.emit('update_users', users);
      console.log(`Users list:`, users);
    }
  });
});

server.listen(PORT, () => {
  console.log('Server listening on port 3000');
});