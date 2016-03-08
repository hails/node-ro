'use strict';

var net = require('net');
var Cluster = require('cluster');
var Logger = require('./utils/logger.js');
var PacketHandler = require('./network/packetHandler.js');
var sprintf = require('./utils/sprintf.js');

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
		Logger.info("Starting Node-Server ...");

		Logger.info("Loading configuration files...");
		this.config = readServerConfig();
		Logger.success("Done loading configuration files.");

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
						Logger.success(sprintf("Node-Server is ready on %s:%s [Main PID: %s]",
							this.config.network.ipAddress, this.config.network.port, this.mainPid || process.pid));
					});
			}
			catch(ex) {
				Logger.error("Error while starting node-server. See logs for more details.");
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