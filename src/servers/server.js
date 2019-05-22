const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', { reconnect: true });

const { SERVICE_RECIVE_MESSAGE } = require('./services/servicesForServers');
const { TIME_HEART_BEATING } = require('./services/constant');

const services = [SERVICE_RECIVE_MESSAGE.name];

socket.on('connect', () => { 
  console.log('A sever is up!');
});

socket.on('onReciveMessage', () => { 
  startReciveMessage();
});

socket.on('onHeartBeating', () => { 
  startReciveHeartBeating();
});

socket.emit('imServer', services);

const startReciveMessage = () => SERVICE_RECIVE_MESSAGE.startService(socket);

const startReciveHeartBeating = () => setInterval(() => socket.emit('heartBeating', services), TIME_HEART_BEATING);
