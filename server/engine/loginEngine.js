var Authentication	= require('./services/authentication.js');
var NetworkUtils    = require('../utils/network.js');
var Packets  		= require('../packets/packetStructure.js');
var NodeServer      = require('../server.js');

/**
  * Node Emulator Project
  *
  * Login-server main engine. Handles all login-server related packets
  *
  * @author Alvaro Bezerra <alvaro.dasmerces@gmail.com>
*/

var LoginEngine = {};

// 0x64
LoginEngine.onLoginRequest = function( pkt, socket ) {
	Authentication.authenticateUser(pkt, onUserAccepted, onUserRejected);

	var responsePkt = {};

	function onUserAccepted( userAccount ) {
		//everything is fine - send packet 0x69 [ACCEPT_LOGIN] to client
		responsePkt = new Packets.OUT.ACCEPT_LOGIN();
		responsePkt.authCode = Math.floor(Math.random() * 100000 + 1);
		responsePkt.aid = 2000001;
		responsePkt.userLevel = 1;
		responsePkt.lastLoginIp = 0;
		responsePkt.lastLoginTime = '';
		responsePkt.sex = 1;
		responsePkt.serverList = [{
			ip: 		NetworkUtils.ipToLong(global._NODE.server.config.network.ipAddress),
			port: 		NodeServer.config.network.port,
			name:   	'NodeRO',
			userCount:  0,
			state:      0, //0 = normal, 1 = on maintenance, 2 = 18+ only, 3 = p2p server
			property:   0  //0 = normal, 1 = new server
		}];

		fwdResponse();
	}

	function onUserRejected( errorCode ) {
		//login failed - send packet 0x6a [REFUSE_LOGIN]
		responsePkt = new Packets.OUT.REFUSE_LOGIN();
		responsePkt.errorCode = errorCode;

		fwdResponse();
	}

	/**
      * Send response back to client and close the connection
	*/
	function fwdResponse() {
		socket.end(responsePkt.toBuffer());
	}
};

//0x65
LoginEngine.onLoginSuccess = function( pkt, socket ) {
	var responsePkt = {};

	console.log("[ I ] LoginEngine::request connect - aid: %s/authCode: %s/userLevel: %s", pkt.aid, pkt.authCode, pkt.userLevel);

	//send back account id (why does the client need this?)
	var aidPkt = new Buffer(4).fill(0);
		aidPkt.writeUInt32LE(pkt.aid);

	socket.write(aidPkt);

	//TO DO: Verificar token de autenticação que foi enviado pelo packet 0x64

	//TO DO: Verificar se player já não está online

	//send character list
	responsePkt = new Packets.OUT.ACCEPT_ENTER_NEO_UNION();

	fwdResponse();

	/**
      * Send response back to client and close the connection
	*/
	function fwdResponse() {
		socket.end(responsePkt.toBuffer());
	}
};

//export
module.exports = LoginEngine;