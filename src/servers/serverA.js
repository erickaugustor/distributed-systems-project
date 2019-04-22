const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', {reconnect: true});
const services = require('../services/servicesForServers');

const services = [services.SERVICE_ONE, services.SERVICE_FOUR];

socket.on('connect', (socket) => { 
  console.log('Connected!');
});

socket.emit('imServer', services);

const heartBeating = () => {
  socket.emit('imAlive', services);
};

setInterval(heartBeating, 1000);
