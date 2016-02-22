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
	if(packetInfo.handler && typeof packetInfo.handler === 'function') {
		packetInfo.handler(packetInstance, socket);
	}
	else {
		console.log("[ W ] PacketHandler::No handler found for packet %s. Ignoring...".yellow, "0x"+packetId.toString(16));
	}

	return;
};

//export
module.exports = PacketHandler;