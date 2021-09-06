'use strict';

let getLogData = (req, data) => {
    //get IP address
    let IPFromRequest = req.connection.remoteAddress || ''
    let indexOfColon = IPFromRequest.lastIndexOf(':')
    let ipaddress = IPFromRequest.substring(indexOfColon + 1, IPFromRequest.length)

    // set logdata
    let logdata = {
        "ipaddress": ipaddress || '',
        "route": req.originalUrl,
        "method": req.method || '',
        "headers": req.headers || '',
        "params": req.params || '',
        "body": req.body || '',
        "query": req.query || '',
        "response_data": data || ''
    }
    return logdata
}

module.exports = (fw) => {
    // call logger
    const logFile = "../../logs/todo.log";
    const myLogger = require('./logger')(logFile, 'stdout', 50000000, 10, 'send')

    fw.use((req, res, next) => {
        res.success = (data, statusCode = 200) => {
            // clear connection every success response
            if (req.db) {
                req.db.end()
            }

            // logging data
            let logdata = getLogData(req, data)
            myLogger.send('response_success', JSON.stringify(logdata))

            // send result
            res.status(statusCode).json({
                status: 'success',
                statusCode: statusCode,
                payload: data || {}
            });
        }

        res.plain = (data, statusCode = 200) => {
            // clear connection every plain response
            if (req.db) {
                req.db.end()
            }

            // logging data
            let logdata = getLogData(req, data)
            myLogger.send('response_plain', JSON.stringify(logdata))

            // send result
            res.status(statusCode).json(data);
        }

        res.error = (err, statusCode = 500) => {
            // clear connection every error response
            if (req.db) {
                req.db.end()
            }

            // statusCode refers to this https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
            let data = {};

            // if error type is string
            if (typeof err === 'string') {
                data = {
                    errors: [{
                        message: err
                    }]
                }
            }

            // if error type is object
            if (typeof err === 'object') {
                if (!err.errors) {
                    let message = err.message;

                    err = JSON.parse(JSON.stringify(err));

                    err.message = message;

                    data = { errors: [err] }
                } else {
                    data = err;
                }
            }

            // logging data
            let logdata = getLogData(req, data)
            myLogger.send('response_error', JSON.stringify(logdata))

            // send result
            res.status(statusCode).json({
                status: 'error',
                statusCode: statusCode,
                payload: data
            });
        }

        res.notfound = (message) => {
            // clear connection every notfound response
            if (req.db) {
                req.db.end()
            }

            // logging data
            let logdata = getLogData(req, message)
            myLogger.send('response_notfound', JSON.stringify(logdata))

            // send result
            res.status(404).json({
                status: 'error',
                statusCode: 404,
                payload: {
                    error: {
                        message: message
                    }
                }
            });
        }

        next();
    })
}