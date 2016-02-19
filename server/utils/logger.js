var fs 		= require('fs');
var path 	= require('path');

/**
  * Node Emulator Project
  *
  * Write server logs
  *
  * @author Alvaro Bezerra <alvaro.dasmerces@gmail.com>
*/

const LoginLogsPath = path.join(__dirname, '../../logs', 'login-server.log');
const CharLogsPath = path.join(__dirname, '../../logs', 'char-server.log');
const MapLogsPath = path.join(__dirname, '../../logs', 'map-server.log');

//export
var Logger = {};
module.exports = Logger;

Logger.loginServer = {};
Logger.charServer = {};
Logger.mapServer = {};

Logger.loginServer.logInfo = function( info ) {
	fs.writeFile(LoginLogsPath, info, 'utf8');
};

Logger.loginServer.logError = function( error ) {
	fs.writeFile(LoginLogsPath, error, 'utf8');
};