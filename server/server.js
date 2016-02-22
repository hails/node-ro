var net 			= require('net');
var Cluster			= require('cluster');
var Logger 			= require('./utils/logger.js');
var PacketHandler	= require('./network/packetHandler.js');

/**
  * Node Emulator Project
  *
  * Instantiate a TCP/IP node emulator server
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

var NodeServer = function() {
	this.isRunning = false;
	this.config = null;
	this.mainPid = null;
	this.clustersPid = [];
};

var startServer = function() {
	console.log("[ I ] Starting node-server ...");

	console.log("[ I ] Loading configuration files...");
	NodeServer.config = readServerConfig();
	console.log("[ I ] Done loading configuration files.".green);

	if(NodeServer.config.features.useClusters && Cluster.isMaster) {
		NodeServer.mainPid = process.pid;

		for(var i = 0; i < NodeServer.config.features.numberOfClusters; i++) {
			Cluster.fork();
		}
	}
	else {
		try {
			net.createServer(PacketHandler)
				.listen(NodeServer.config.network.port, NodeServer.config.network.ipAddress, function() {
					console.log("  --> Node-server is ready on %s:%s [Main PID: %s]".green,
						NodeServer.config.network.ipAddress, NodeServer.config.network.port, NodeServer.mainPid || process.pid);

					NodeServer.isRunning = true;
				});
		}
		catch(ex) {
			Logger.loginServer.logError(ex);
			console.error("[ E ] Error while starting node-server. See logs for more details.".red);

			process.exit(1);
		}
	}
};

function readServerConfig() {
	var 
		_extend 	= require('util')._extend,
		_config 	= {},
		network 	= _extend(_config, require('./configuration/network.js')),
		client		= _extend(_config, require('./configuration/client.js')),
		features	= _extend(_config, require('./configuration/features.js'));

	return _config;
}

//export
exports.start = startServer;
exports.get = NodeServer;