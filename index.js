'use strict';

// require('dotenv').config();

// set application environment
global.ENV = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3000;
const express = require('express');
const fw = express();

//load the application
require('./app/index')(fw)

console.log('listen to port : ', port);

fw.listen(port);

module.exports = fw