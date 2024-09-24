const fs = require('fs');
const path = require('path');

// Log events function
const logEvent = (message) => {
  const logFilePath = path.join(__dirname, 'logs.txt');
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;

  // Append the log message to a log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) throw err;
  });
};

module.exports = logEvent;
