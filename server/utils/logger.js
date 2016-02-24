var fs 		= require('fs');
var path 	= require('path');
var moment  = require('moment');

/**
  * Node Emulator Project
  *
  * Write server logs
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

const LogsPath = path.join(__dirname, '../../logs', 'node-server.log');
const LogDateFormat = "YYYY-MM-DD HH:mm:ss";

var Logger = {};

Logger.logInfo = function( info ) {
	fs.writeFile(moment().format(LogDateFormat) + " " + LogsPath, info, 'utf8');
};

Logger.logError = function( error ) {
	fs.writeFile(moment().format(LogDateFormat) + " " + LogsPath, error, 'utf8');
};

//export
module.exports = Logger;