var PacketDB 		= require('../packets/packetDatabase.js');
var PacketReader	= require('../utils/packetReader.js');

/**
  * Node Emulator Project
  *
  * Handle incoming packets
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

var PacketHandler = function( socket ) {
	socket.on('data', function( data ) {
		onPacketReceived(data, socket);
	});
};

/**
 * Receives a packet and validate its size and structure.
 * If everything is ok, call the corresponding engine function
 * 
 * @param {Object} data A buffer object
 * @param {Object} socket Client's socket
*/
function onPacketReceived( data, socket ) {
	if(!data || data.length < 2) {
		console.log("[ W ] PacketHandler::Invalid data received. Ignoring...".red);
		return;
	}

	/** The 2 bytes of packet's buffer is reserved to packet id/type */
	var packetId = data.readUInt16LE();

	/** Gets packet data by its id/type */
	var packetInfo = PacketDB[packetId];
	
	/** Check if packet is in database */
	if(!packetInfo) {
		console.log("[ W ] PacketHandler::Unknown packet %s received. Ignoring...".yellow, "0x"+packetId.toString(16));
		return;
	}

	/** Check if packet has the correct size */
	if(packetInfo.struct.size != data.length) {
		console.log("[ W ] PacketHandler::Packet %s with invalid size. Ignoring...".yellow, "0x"+packetId.toString(16));
		return;
	}

	var packetReader = new PacketReader(data);
	var packetInstance = new packetInfo.struct(packetReader);

	/** Call engine function to handle the packet */
	return packetInfo.handler(packetInstance, onResponseReady);
};

/**
 * Send response packet back to client and
 * may close, or not, the connection
 * 
 * @this {Object} Client's socket
 * @param {Object} response Response packet
 * @param boolean keepAlive Either keep or not the connection open
*/
function onResponseReady( responsePkt, keepAlive ) {
	return keepAlive ? this.write(responsePkt.toBuffer()) : this.end(responsePkt.toBuffer());
}

//export
module.exports = PacketHandler;