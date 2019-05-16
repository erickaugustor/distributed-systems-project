const fs = require('fs');

const SERVICE_RECIVE_MESSAGE = {
  name: 'reciveMessage',
  startService: (socket) => (
    socket.on('reciveMessage', messagePack => { 
      const whereIsFile = `./drive/${messagePack.name}-${messagePack.countMessage}.txt`;
      console.log(whereIsFile);

      fs.writeFile(whereIsFile, messagePack.message, (err) => {
        if (err) throw err;
      });
    })
  )
};

module.exports = { 
  SERVICE_RECIVE_MESSAGE,
}