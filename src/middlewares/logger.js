'use strict';

module.exports = (logFile, category, logSize, backups, level) => {
    // use module and set configuration
    let log4js = require('log4js')
    let config = JSON.stringify({
        appenders: {
            'out': {
                type: 'stdout' } 
        },
        categories: { 
            default: { 
                appenders: ['out'], 
                level: 'info' 
            } 
        }
      }
    )
    config = JSON.parse(config)
    log4js.configure(config)

    // calling an logger for specific category
    let logger = log4js.getLogger(category)

    let myLogger = {};

    myLogger.send = (action, message) => {
        let logData = { "action": action, "data-log": message };
        logger.trace(logData)
    }

    return myLogger;
}