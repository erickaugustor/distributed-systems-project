const fs = require('fs');
const { MAX_NUMBER_OF_COPIES } = require('./constant');

const SERVICE_RECIVE_MESSAGE = {
  name: 'reciveMessage',
  startService: (socket) => (
    socket.on('reciveMessage', messagePack => { 
      for (let version = 1; version <= MAX_NUMBER_OF_COPIES; version++) {
        let whereIsFile = `../../logger/[${messagePack.name}-${messagePack.countMessage}][${version}].txt`;

        fs.writeFile(whereIsFile, messagePack.message, (err) => {
          if (err) throw err;
        });
      }
    })
  )
};

module.exports = { 
  SERVICE_RECIVE_MESSAGE,
}