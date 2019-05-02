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
    mappingServicesByServer.push({
      server: socket.id,
      services,
    });

    services.forEach(service => {
      if (listOfServers.find((item) => service === item)) {
        mappingServicesInfo[service].servers.push(socket.id);
      };

      let newService = {};
      newService[service] = { servers: [socket.id] };

      mappingServicesInfo.push(newService);
    });
  });

  socket.on('imAlive', (service) => {
    console.log('im alive', service);
  });

  socket.on('serviceOne', (what) => {
    console.log(what);
  });

  socket.on('disconnect', () => {
    mappingServicesByServer.filter(item => item.server !== socket.id);
    io.emit('message', 'A user has left! :(');
  });
});

server.listen(port, () => {
  writeLogger.welcomeMessage(port);
  console.log(`Server is up on port ${port}!`);
});
