var io = require('socket.io-client');

var socket = io.connect('http://localhost:3000', {reconnect: true});

socket.on('connect', (socket) => { 
  console.log('Connected!');
});

socket.emit('imServer', ['servicoOne', 'servicoTwo']);