'use strict';

var net 			= require('net');
var Cluster			= require('cluster');
var Logger 			= require('./utils/logger.js');
var PacketHandler	= require('./network/packetHandler.js');

/**
  * Node Emulator Project
  *
  * Node Emulator Server class
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

class NodeServer {
	constructor() {
		this.config = null;
		this.mainPid = null;
		this.clustersPid = [];
	}

	start() {
		console.log("[ I ] Starting node-server ...");

		console.log("[ I ] Loading configuration files...");
		this.config = readServerConfig();
		console.log("[ I ] Done loading configuration files.".green);

		if(this.config.features.useClusters && Cluster.isMaster) {
			this.mainPid = process.pid;

			for(var i = 0; i < this.config.features.numberOfClusters; i++) {
				Cluster.fork();
			}
		}
		else {
			try {
				net.createServer(PacketHandler)
					.listen(this.config.network.port, this.config.network.ipAddress, () => {
						console.log("  --> Node-server is ready on %s:%s [Main PID: %s]".green,
							this.config.network.ipAddress, this.config.network.port, this.mainPid || process.pid);
					});
			}
			catch(ex) {
				Logger.logError(ex);
				console.error("[ E ] Error while starting node-server. See logs for more details.".red);

				process.exit(1);
			}
		}		
	}
}

function readServerConfig() {
	var 
		_extend 	= require('util')._extend,
		_config 	= {},
		network 	= _extend(_config, require('./configuration/network.js')),
		client		= _extend(_config, require('./configuration/client.js')),
		features	= _extend(_config, require('./configuration/features.js'));

	return _config;
}

// startup initilization
var _serverInstance = new NodeServer();

//export
module.exports = _serverInstance;