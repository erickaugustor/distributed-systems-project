const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');

const writeLogger = require('./services/writeLogger');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

const mappingServicesByServer = [];
const mappingServicesInfo = [];
const listOfServers = [];

let countServer = 0;
let countClient = 0;
let countMessage = 0;

if (!fs.existsSync('./logger/')){
  fs.mkdirSync('./logger/');
};

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  const socketInfo = {};

  socket.emit('message', `Welcome ${socket.id}`);
  socket.broadcast.emit('message', `A new user called ${socket.id} has joined!`);

  socket.on('sendMessage', message => {
    writeLogger.newMessage(`[${socketInfo.name}][${new Date().toString()}] - Send a message to the server: "${message}"`);
    countMessage++;

    const messagePack = {
      id: socketInfo.id,
      countMessage,
      name: socketInfo.name,
      message,
      sender: socketInfo.name,
    };

    io.to(listOfServers[0]).emit('reciveMessage', messagePack);
  });

  socket.on('imServer', (services) => {
    countServer++;
    socketInfo.name = `SERVER-00${countServer}`;
    writeLogger.newMessage(`[${socketInfo.name}][${new Date().toString()}] - New Server: ${socket.id} `);

    mappingServicesByServer.push({
      server: socket.id,
      services,
    });

    listOfServers.push(socket.id);

    services.forEach(service => {
      if (listOfServers.find((item) => service === item)) {
        mappingServicesInfo[service].servers.push(socket.id);
      };

      let newService = {};
      newService[service] = { servers: [socket.id] };

      mappingServicesInfo.push(newService);
    });

    io.to(socket.id).emit('onReciveMessage');
    io.to(socket.id).emit('onHeartBeating');
  });

  socket.on('imClient', () => {
    countClient++;
    socketInfo.id = socket.id;
    socketInfo.name = `USER-00${countClient}`;
    writeLogger.newMessage(`[${socketInfo.name}][${new Date().toString()}] - New User: ${socket.id} `);
  });

  socket.on('heartBeating', (services) => {
    writeLogger.newMessage(`[${socketInfo.name}][${new Date().toString()}] - Heart Beating: ${services} `);
  });

  socket.on('disconnect', () => {
    writeLogger.newMessage(`[${socketInfo.name}][${new Date().toString()}] - Goodbye: ${socket.id} `);

    if (listOfServers.includes(socket.id)) {
      mappingServicesByServer.filter(item => item.server !== socket.id);
      listOfServers.filter(item => item.server !== socket.id);
    } else {
      io.emit('message', `The user ${socketInfo.name} has left!`);
    }
  });
});

server.listen(port, () => {
  writeLogger.welcomeMessage(port);
  console.log(`Server is up on port ${port}!`);
});
