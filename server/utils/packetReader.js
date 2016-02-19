/**
  * Node Emulator Project
  *
  * Reads buffer data from incoming packets
  * Automatically controls buffer's offset
  * 
  * @author Alvaro Bezerra <alvaro.dasmerces@gmail.com>
*/

var PacketReader = function( buffer, startingOffset ) {
	this.buffer = buffer;
	/**
	  * The 2 bytes is reserved to packet type/id
	*/
	this.offset = startingOffset ? startingOffset : 2;
};

PacketReader.prototype.readUInt8 = function() {
	var val = this.buffer.readUInt8(this.offset);
	this.offset += 1;

	return val;
};

PacketReader.prototype.readUInt16 = function() {
	var val = this.buffer.readUInt16(this.offset);
	this.offset += 2;

	return val;
};

PacketReader.prototype.readUInt32 = function() {
	var val = this.buffer.readUInt32LE(this.offset);
	this.offset += 4;

	return val;
};

PacketReader.prototype.readString = function( strLength ) {
	var val = this.buffer.toString('utf8', this.offset, this.offset + strLength);
	this.offset += strLength;

	return normalizeString(val);
};

/**
  * Removes null-terminated characters from a string
*/
function normalizeString( str ) {
	return str.replace(/\0/g, "");
}

//export
module.exports = PacketReader;