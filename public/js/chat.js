const socket = io();

socket.emit('imClient', 'hi');

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, () => {
    console.log('The message was delivered');
  });
});

/*
document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  };

  navigator.geolocation.getCurrentPosition((position) => {
     socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
     });
  });
});
*/

document.querySelector('#service-one').addEventListener('click', () => {
  socket.emit('serviceOne', 'I want!');
});