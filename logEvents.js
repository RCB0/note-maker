const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');

// Check if logs directory exists, create it if it doesn't
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logEvent = (message) => {
    const logFilePath = path.join(logDir, 'eventLog.txt');
    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error(`Failed to log event: ${err}`);
        }
    });
};

module.exports = { logEvent };
