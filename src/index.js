const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
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
const data = new Date();

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket, a) => {
  console.log('New WebSocket connection: ', socket.id);

  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined!');

  socket.on('sendMessage', (message, callback) => {
    io.emit('message', message);
    callback();
  });

  socket.on('imServer', (services) => {
    countServer++;
    writeLogger.newMessage(`[SERVER-00${countServer}][${data.toString()}] - New Server: ${socket.id} `);

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
  });

  socket.on('imClient', (message) => {
    console.log('omgIm ', message);
  });

  socket.on('imAlive', (service) => {
    console.log('im alive', service);
  });

  socket.on('serviceOne', (what) => {
    console.log(what);
  });

  socket.on('disconnect', () => {
    if (listOfServers.includes(socket.id)) {
      countServer--;
      mappingServicesByServer.filter(item => item.server !== socket.id);
    } else {
      io.emit('message', 'A user has left! :(');
    }
  });
});

server.listen(port, () => {
  writeLogger.welcomeMessage(port);
  console.log(`Server is up on port ${port}!`);
});
