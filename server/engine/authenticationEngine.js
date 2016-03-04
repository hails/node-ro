var AuthenticationService   = require('./services/authenticationService.js');
var NetworkUtils 			= require('../utils/network.js');
var NetworkConfig 			= require('../configuration/network.js').network;
var Packets 				= require('../packets/packetStructure.js');
var Redis 					= require('../database/redisManager.js');
var AuthenticationNode 		= require('../model/authenticationNode.js');

/**
 * Node Emulator Project
 *
 * Authentication engine. Handles all authentication related packets
 *
 * @class AuthenticationEngine
 * @static
 * @author Alvaro Bezerra <https://github.com/alvarodms>
*/
class AuthenticationEngine {
    
    /**
     * Handles packet 0x64 - LOGIN
     * Sent by client when the user enters his aid and password
     * 
     * @param {Object} pkt 0x64 packet structure
     * @param {Object} socket Client's socket
    */
    static onAuthenticationRequest( pkt, onResponseReady ) {
    	AuthenticationService.authenticateUser(pkt, onAuthenticationSuccess, onAuthenticationFailed);
    
    	var responsePkt = {};
    
    	function onAuthenticationSuccess( userAccount ) {
    		//everything is fine - send packet 0x69 [ACCEPT_LOGIN] to client
    		responsePkt = new Packets.OUT.ACCEPT_LOGIN();
    		responsePkt.authCode = Math.floor(Math.random() * 100000 + 1);
    		responsePkt.aid = 2000001;
    		responsePkt.userLevel = 1;
    		responsePkt.lastLoginIp = 0;
    		responsePkt.lastLoginTime = '';
    		responsePkt.sex = 1;
    		responsePkt.serverList = [{
    			ip: 		NetworkUtils.ipToLong(NetworkConfig.ipAddress),
    			port: 		NetworkConfig.port,
    			name:   	'NodeRO',
    			userCount:  0,
    			state:      0, //0 = normal, 1 = on maintenance, 2 = 18+ only, 3 = p2p server
    			property:   0  //0 = normal, 1 = new server
    		}];
    
    		onResponseReady(responsePkt);
    		
    		//cache authentication node
    		let authNode 			= new AuthenticationNode();
    			authNode.authCode 	= responsePkt.authCode;
    			authNode.userLevel 	= responsePkt.userLevel;
    			authNode.sex 		= responsePkt.sex;
    			//authNode.ip 		= socket.remoteAddress;
    			authNode.ip         = 0;
    			authNode.version 	= pkt.version;
    			authNode.clientType = pkt.clientType;
    			
    		let redisClient = Redis.manager.getClient();
    		
    		redisClient.select(Redis.databases.AUTH_DB, function() {
    			redisClient.set(responsePkt.aid, JSON.stringify(authNode));
    			redisClient.expire(responsePkt.aid, 60); //auth node expiration time
    		});
    	}
    
    	function onAuthenticationFailed( errorCode ) {
    		//login failed - send packet 0x6a [REFUSE_LOGIN]
    		responsePkt = new Packets.OUT.REFUSE_LOGIN();
    		responsePkt.errorCode = errorCode;
    
    		onResponseReady(responsePkt);
    	}
    }
    
    /**
     * Handles packet 0x65 - ENTER
     * Sent by client when the user selects a char-server to login
     * 
     * @param {Object} pkt 0x65 packet structure
     * @param {Object} scoket Client's socket
    */
    static onLoginRequest( pkt, onResponseReady ) {
    	var responsePkt = {};
    
    	console.log("[ I ] LoginEngine::request connect - aid: %s/authCode: %s/userLevel: %s", pkt.aid, pkt.authCode, pkt.userLevel);
    
    	//send back account id (why does the client need this?)
    	var aidPkt   = new Packets.OUT.UINT32_RESPONSE();
        aidPkt.value = pkt.aid;
    	onResponseReady(aidPkt, true);
    
    	var redisClient = Redis.manager.getClient();
    	
    	//Retrieve auth node from cache
    	//if not found, rejects the user
    	redisClient.select(Redis.databases.AUTH_DB, function() {
    		redisClient.get(pkt.aid, function( err, data ) {
    			if(err || data == null) {
    				return onUserRejected();
    			}
    			
    			let authNode = JSON.parse(data);
    			
    			if(authNode.authNode !== pkt.authCode ||
    				authNode.userLevel !== pkt.userLevel ||
    				authNode.sex !== pkt.sex)
    				//authNode.ip !== socket.remoteAddress)
    				{
    					return onUserRejected();
    				}
    				
    			//delete auth node
    			redisClient.del(pkt.aid);
    				
    			return onUserAccepted();
    		});	
    	});
    	
    	function onUserRejected() {
    		//reject user
    		responsePkt = new Packets.OUT.REFUSE_ENTER();
    		responsePkt.errorCode = 0; //rejected from server
    		
    		onResponseReady(responsePkt);
    	}
    	
    	function onUserAccepted() {
    		//TO DO: Verificar se player já não está online
    		
    		//send character list
    		responsePkt = new Packets.OUT.ACCEPT_ENTER_NEO_UNION();
    		
    		onResponseReady(responsePkt);
    	}
    }
}