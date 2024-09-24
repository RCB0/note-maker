const fs = require('fs');
const path = require('path');

// Function to log events to a file
const logEvent = (message) => {
    const dateTime = new Date().toISOString();
    const logMessage = `${dateTime} - ${message}\n`;
    fs.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logMessage, (err) => {
        if (err) {
            console.error('Failed to log event:', err);
        }
    });
};

module.exports = { logEvent };
