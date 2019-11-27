'use strict';

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var FeaturesConfig = require('../configuration/features.js').features;

/**
  * Node Emulator Project
  *
  * Write server logs
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

const LogsPath = path.join(__dirname, '../logs', 'node-server.log');
const LogDateFormat = "YYYY-MM-DD HH:mm:ss";
const LogTypes = {
	ALL: 0,
	INFO: 1,
	WARNING: 2,
	ERROR: 3
}

var Logger = console

//export
module.exports = Logger;
