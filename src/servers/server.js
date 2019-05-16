const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', { reconnect: true });

const { SERVICE_RECIVE_MESSAGE } = require('./services/servicesForServers');
const { TIME_HEART_BEATING } = require('./services/constant');

const services = [SERVICE_RECIVE_MESSAGE.name];

socket.on('connect', (socket) => { 
  console.log('Connected!');
});

socket.emit('imServer', services);

SERVICE_RECIVE_MESSAGE.startService(socket);

const heartBeating = () => {
  socket.emit('imAlive', services);
};

setInterval(heartBeating, TIME_HEART_BEATING);
