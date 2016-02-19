#!/usr/bin/env node

require('colors');
var NodeServer        = require('./server/server.js');
var MongoDB           = require('./server/mongodb/connectionManager.js');

/**
  * Node Emulator Project
  * A Ragnarok Online emulator built with NodeJS
  *
  * @author		Alvaro Bezerra <alvaro.dasmerces@gmail.com>
  * @version	1.0
  * @since		2015-12-03
*/

global._NODE = {};

console.log("---- <Node Emulator Project> ----".blue);
console.log("---- A ragnarok emulator written with node.js ----".blue);
console.log("---- by alvaro.dasmerces@gmail.com ----".blue);

console.log("[ I ] Node Emulator is starting...");

/** MongoDB initialization */
new MongoDB(onMongoDBReady);

function onMongoDBReady( _db ) {
  global._NODE.db = _db;

  /** Node-server initialization */
  NodeServer.start();
}