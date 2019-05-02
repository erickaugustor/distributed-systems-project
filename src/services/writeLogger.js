const fs = require('fs');

const whereIsFile = './data/logger.txt';
const newLine = '\n';

const newMessage = (message) => {
  console.log(message);
  fs.appendFile(whereIsFile, `${message}.${newLine}`, (err) => {
    if (err) throw err;
  });
};

const welcomeMessage = (port) => {
  console.log(port);
  fs.writeFile(whereIsFile, `Welcome to myDirectory - Server is up on port: ${port}.${newLine}`, (err) => {
    if (err) throw err;
  });
};

module.exports = {
  newMessage, 
  welcomeMessage,
};
