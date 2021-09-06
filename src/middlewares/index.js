'use strict';

let loadMiddlewares = (app, rootpath) => {
    const bodyParser = require('body-parser');
    const path = require('path');

    // body parser for json-encoded
    app.use(bodyParser.json({
        // maximum request body size
        // use https://www.npmjs.com/package/bytes as reference for defining byte calculation
        limit: '2000kb',
        'strict': false,
        type: '*/json'
    }));

    // body parser for url-encoded
    app.use(bodyParser.urlencoded({
        limit: '100kb',
        // parsing the URL-encoded data with the querystring library (false) or qs library (true)
        extended: false
    }));

    
    
}

module.exports = loadMiddlewares;