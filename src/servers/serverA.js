const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', {reconnect: true});
const services = require('../services/servicesForServers');

socket.on('connect', (socket) => { 
  console.log('Connected!');
});

socket.emit('imServer', ['servicoOne', 'servicoTwo']);


const heartBeating = () => {
  socket.emit('imAlive', ['servicoOne', 'servicoTwo']);
};

setInterval(heartBeating, 1000);
