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

var Logger = {};

//erase log content on initialization
fs.writeFile(LogsPath, "");

/** INFO logger */
if(FeaturesConfig.log.enableLogging && (FeaturesConfig.log.logLevel === LogTypes.INFO || FeaturesConfig.log.logLevel === LogTypes.ALL)) {
	Logger.info = function( msg ) {
		console.log("[ I ] " + msg);
		fs.appendFile(LogsPath, moment().format(LogDateFormat) + " [ I ] " + msg + "\n");
		return;
	};
}
else {
	//Logging not enabled, just outputs to console.log
	Logger.info = function( msg ) {
		console.log("[ I ] " + msg);
		return;
	};	
}

/** WARNING logger */
if(FeaturesConfig.log.enableLogging && (FeaturesConfig.log.logLevel === LogTypes.WARNING || FeaturesConfig.log.logLevel === LogTypes.ALL)) {
	Logger.warn = function( msg ) {
		console.log("[ W ] " + msg.toString().yellow);
		fs.appendFile(LogsPath, moment().format(LogDateFormat) + " [ W ] " + msg + "\n");
		return;
	};
}
else {
	//Logging not enabled, just outputs to console.log
	Logger.warn = function( msg ) {
		console.log("[ W ] " + msg.toString().yellow);
		return;
	};	
}

/** ERROR logger */
if(FeaturesConfig.log.enableLogging && (FeaturesConfig.log.logLevel === LogTypes.ERROR || FeaturesConfig.log.logLevel === LogTypes.ALL)) {
	Logger.error = function( msg ) {
		console.log("[ E ] " + msg.toString().red);
		fs.appendFile(LogsPath, moment().format(LogDateFormat) + " [ E ] " + msg + "\n");
		return;
	};
}
else {
	//Logging not enabled, just outputs to console.log
	Logger.error = function( msg ) {
		console.log("[ E ] " + msg.toString().red);
		return;
	};	
}

/** Success messages logger */
if(FeaturesConfig.log.enableLogging && (FeaturesConfig.log.logLevel === LogTypes.INFO || FeaturesConfig.log.logLevel === LogTypes.ALL)) {
	Logger.success = function( msg ) {
		console.log("[ I ] ".green + msg.toString().green);
		fs.appendFile(LogsPath, moment().format(LogDateFormat) + " [ I ] " + msg + "\n");
		return;
	};
}
else {
	//Logging not enabled, just outputs to console.log
	Logger.success = function( msg ) {
		console.log("[ I ] ".green + msg.toString().green);
		return;
	};	
}

//export
module.exports = Logger;