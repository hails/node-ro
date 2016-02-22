var PacketStructure 	= require('./packetStructure.js');
var LoginEngine			= require('../engine/loginEngine.js');

/**
  * Node Emulator Project
  *
  * Link all packets ID to their respective structure and handler
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

//export
module.exports = {
	//in
	0x64: { struct: PacketStructure.IN.LOGIN, handler: LoginEngine.onLoginRequest },
	0x65: { struct: PacketStructure.IN.ENTER, handler: LoginEngine.onLoginSuccess },

	//out
	0x69: { struct: PacketStructure.OUT.ACCEPT_LOGIN }
};