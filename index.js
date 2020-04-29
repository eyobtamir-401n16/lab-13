'use strict';
require('dotenv').config();
const server = require('./lib/server.js');
const port = process.env.PORT;
const MONOGDB_URI = process.env.MONGODB_URI;

server.start(port, MONOGDB_URI);
