const fs = require('fs');
const path = require('path');

function logEvent(message) {
    const logPath = path.join(__dirname, 'events.log');
    fs.appendFileSync(logPath, `${new Date().toISOString()}: ${message}\n`);
}

module.exports = logEvent;
