const fs = require('fs');

const whereIsFile = './logger/logger.txt';
const newLine = '\n';

const newMessage = (message) => {
  console.log(message);
  fs.appendFile(whereIsFile, `${message}${newLine}`, (err) => {
    if (err) throw err;
  });
};

const welcomeMessage = (port) => {
  const message = `Welcome to myDirectory - Server is up on port: ${port}.${newLine}`;
  fs.writeFile(whereIsFile, message, (err) => {
    if (err) throw err;
  });
};

module.exports = {
  newMessage, 
  welcomeMessage,
};
