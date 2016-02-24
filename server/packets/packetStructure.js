/**
  * Node Emulator Project
  *
  * Server packets structure
  * Based on roBrowser project <https://github.com/vthibault/roBrowser/>

  * PACKET.IN:  Client -> Server packets
  * PACKET.OUT: Server -> Client packets

  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

var PACKET 		= {};
	PACKET.IN 	= {};
	PACKET.OUT	= {};

// 0x64
PACKET.IN.LOGIN = function( pReader ) {
	this.version 	= pReader.readUInt32();
	this.id 		= pReader.readString(24);
	this.password 	= pReader.readString(24);
	this.clientType = pReader.readUInt8();
};
PACKET.IN.LOGIN.size = 55;

// 0x65
PACKET.IN.ENTER = function( pReader ) {
	this.aid 		= pReader.readUInt32();
	this.authCode 	= pReader.readUInt32();
	this.userLevel	= pReader.readUInt32();
	this.clientType = pReader.readUInt8();
	this.sex		= pReader.readString(1);
};
PACKET.IN.ENTER.size = 17;

// 0x69
PACKET.OUT.ACCEPT_LOGIN = function() {
	this.authCode 		= 0;
	this.aid 			= 0;
	this.userLevel 		= 0;
	this.lastLoginIp 	= 0;
	this.lastLoginTime 	= '';
	this.sex 			= '';
	this.serverList 	= [];
};
PACKET.OUT.ACCEPT_LOGIN.prototype.toBuffer = function() {
	var buf 	= new Buffer(47 + 32*this.serverList.length).fill(0),
		offset	= 0;

	offset = buf.writeUInt16LE(0x69, offset); //packet type/id
	offset = buf.writeUInt16LE(47 + 32*this.serverList.length, offset); //packet size
	offset = buf.writeUInt32LE(this.authCode, offset);
	offset = buf.writeUInt32LE(this.aid, offset);
	offset = buf.writeUInt32LE(this.userLevel, offset);
	offset = buf.writeUInt32LE(this.lastLoginIp, offset);
	//buf.write(this.lastLoginTime, offset, 26); offset += 26;
	//buf.write(this.sex, offset, 1); offset +=  1;
	buf.write(this.lastLoginTime, offset, 24); offset += 24;
	offset = buf.writeUInt16LE(0, offset); //unknown
	offset = buf.writeUInt8(this.sex, offset);

	for(var i = 0; i < this.serverList.length; i++) {
		offset = buf.writeUInt32BE(this.serverList[i].ip, offset); //I don't know why, but the client reads the IP as Big-endian
		offset = buf.writeUInt16LE(this.serverList[i].port, offset);
		buf.write(this.serverList[i].name, offset, 20); offset += 20;
		offset = buf.writeUInt16LE(this.serverList[i].userCount, offset);
		offset = buf.writeUInt16LE(this.serverList[i].state, offset);
		offset = buf.writeUInt16LE(this.serverList[i].property, offset);
	}
	
	return buf;
};

// 0x6a
PACKET.OUT.REFUSE_LOGIN = function() {
	this.errorCode = 0;
	this.blockDate = '';
};
PACKET.OUT.REFUSE_LOGIN.prototype.toBuffer = function() {
	var buf 	= new Buffer(23).fill(0),
		offset 	= 0;

	offset += buf.writeUInt16LE(0x6a, offset); //packet type/id
	offset += buf.writeUInt8(this.errorCode, offset);
	offset += buf.write(this.blockDate, offset, 20);

	return buf;
};

// 0x83e
PACKET.OUT.REFUSE_LOGIN_R2 = function() {
	this.errorCode = 0;
	this.blockDate = '';
};
PACKET.OUT.REFUSE_LOGIN_R2.prototype.toBuffer = function() {

};

// 0x82d
PACKET.OUT.ACCEPT_ENTER_NEO_UNION_HEADER = function() {
	this.totalSlotNum = 0;
	this.premiumStartSlot = 0;
	this.premiumEndSlot = 0;
	this.dummy1_beginBilling = 0;
	this.code = 0;
	this.charInfo = [];	
};
PACKET.OUT.ACCEPT_ENTER_NEO_UNION_HEADER.prototype.toBuffer = function() {
	var buf 	= new Buffer(29),
		offset	= 0;
		
	offset = buf.writeUInt16LE(0x82d, offset); //packet type/id
	offset = buf.writeUInt16LE(29, offset); //packet size
	offset = buf.writeUInt8(1, offset); //available slots??
	offset = buf.writeUInt8(9 - 1, offset); //max_chars - available slots??
	offset = buf.writeUInt8(0, offset); //?????
	offset = buf.writeUInt8(1, offset); //?????
	offset = buf.writeUInt8(1, offset); //?????
	offset = buf.write('', offset, 20); //unused bytes
	
	return buf;
};

// 0x6b
PACKET.OUT.ACCEPT_ENTER_NEO_UNION = function() {
	this.totalSlotNum = 0;
	this.premiumStartSlot = 0;
	this.premiumEndSlot = 0;
	//this.dummy1_beginBilling = 0;
	//this.code = 0;
	//this.time1 = 0;
	//this.time2 = 0;
	//this.dummy1_endbilling = '';
	this.charInfo = [];
};
PACKET.OUT.ACCEPT_ENTER_NEO_UNION.prototype.toBuffer = function() {
	var buf 	= new Buffer(27 + 3*114),
		offset	= 0;

	offset = buf.writeUInt16LE(0x6b, offset); //packet type/id
	offset = buf.writeUInt16LE(27, offset); //packet size
	offset = buf.writeUInt8(this.totalSlotNum, offset);
	offset = buf.writeUInt8(this.premiumStartSlot, offset);
	offset = buf.writeUInt8(this.premiumEndSlot, offset);
	offset = buf.write('', offset, 20); //unecessary data

	return buf;
};

// 0x6c
PACKET.OUT.REFUSE_ENTER = function() {
	this.errorCode = 0;
};
PACKET.OUT.REFUSE_ENTER.prototype.toBuffer = function() {
	var buf		= new Buffer(3),
		offset  = 0;
		
	offset = buf.writeUInt16LE(0x6c, offset); //packet type/id
	offset = buf.writeUInt8(this.errorCode, offset);
	
	return buf;
};

//export
module.exports = PACKET;