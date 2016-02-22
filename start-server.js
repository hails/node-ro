#!/usr/bin/env node

require('colors');
var NodeServer  = require('./server/server.js');
var MongoDB     = require('./server/database/connectionManager.js');
var Redis       = require('./server/database/redisManager.js');
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
console.log("---- by alvaro.dasmerces@gmail.com ----".blue);

console.log("[ I ] Node Emulator is starting...");

Async.parallel([
  /** MongoDB initialization */
  function( callback ) {
    new MongoDB(x => {
      return callback();
    });
  },
  
  /** Redis initialization */
  function( callback ) {
    Redis.manager.init(x => {
      return callback();
    });
  }
], function( error, results ) {
  if(error) {
    console.log("[ E ] StartServer::An error occurred while connecting to MySQL and/or Redis. See logs for more details.".red);
    return process.exit(1);
  }
  
  return onDatabasesReady();
});

function onDatabasesReady( _db ) {
  global._NODE.db = _db;

  /** Node-server initialization */
  NodeServer.start();
}