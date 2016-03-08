#!/usr/bin/env node

require('colors');
var NodeServer  = require('./server/server.js');
var MongoDB     = require('./server/infrastructure/mongoManager.js');
var Redis       = require('./server/infrastructure/redisManager.js');
var Async       = require('async');

/**
  * Node Emulator Project
  * A Ragnarok Online emulator built with NodeJS
  *
  * @author		Alvaro Bezerra <https://github.com/alvarodms>
  * @version	1.0
  * @since		2015-12-03
*/

global._NODE = {};

console.log("---- <Node Emulator Project> ----".blue);
console.log("---- A ragnarok emulator written with node.js ----".blue);
console.log("---- by Alvaro Bezerra <https://github.com/alvarodms> ----".blue);

console.log("[ I ] Node Emulator is starting...");

/** Connect to Mongo and Redis in parallel */
Async.parallel([
  startMongo,
  startRedis
], function( error, results ) {
  if(error) {
    console.log("[ E ] StartServer::An error occurred while connecting to MySQL and/or Redis. See logs for more details.".red);
    return process.exit(1);
  }
  
  return onDatabasesReady();
});

/** MongoDB async helper */
function startMongo( onComplete ) {
  MongoDB.manager.init(() => {
    return onComplete();
  });
}

/** Redis async helper */
function startRedis( onComplete ) {
  Redis.manager.init(() => {
    return onComplete();
  });
}

function onDatabasesReady() {
  /** Node-server initialization */
  NodeServer.start();
}