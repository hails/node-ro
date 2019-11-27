var PacketDB = require('../packets/packetDatabase.js');
var PacketReader = require('../utils/packetReader.js');
var Logger = require('../utils/logger.js');
var printf = require('../utils/sprintf.js');

/**
  * Node Emulator Project
  *
  * Handle incoming packets
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

var PacketHandler = function( socket ) {
	socket.on('data', function( data ) {
		console.log('Packet length: ', data.length)


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
		Logger.warn("PacketHandler::Invalid data received. Ignoring...");
		return;
	}

	/** The 2 bytes of packet's buffer is reserved to packet id/type */
	var packetId = data.readUInt16LE();

	/** Gets packet data by its id/type */
	var packetInfo = PacketDB[packetId];

	/** Check if packet is in database */
	if(!packetInfo) {
		Logger.warn(printf("PacketHandler::Unknown packet %s received. Ignoring...", "0x"+packetId.toString(16)));
		return;
	}

	/** Check if packet has the correct size */
	if(packetInfo.struct.size != data.length) {
		Logger.warn(printf("PacketHandler::Packet %s with invalid size. Ignoring...", "0x"+packetId.toString(16)));
		return;
	}

	var packetReader = new PacketReader(data);
	var packetInstance = new packetInfo.struct(packetReader);

	/** Call engine function to handle the packet */
	packetInfo.handler(packetInstance, function(responsePkt) {
		return onResponseReady(responsePkt, socket);
	});
};

/**
 * Send response packet back to client
 *
 * @param {Object} response Response packet
 * @param {Object} socket Client's socket
*/
function onResponseReady( responsePkt, socket ) {
	return socket.write(responsePkt.toBuffer());
}

//export
module.exports = PacketHandler;
