const socket = io();

socket.emit('imClient', 'hi');

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message);
});

document.querySelector('#service-one').addEventListener('click', () => {
  socket.emit('serviceOne', 'I want!');
});