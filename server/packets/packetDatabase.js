var PacketStructure 		= require('./packetStructure.js');
var AuthenticationEngine	= require('../engine/authenticationEngine.js');

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
	0x64: { struct: PacketStructure.IN.LOGIN, handler: AuthenticationEngine.onAuthenticationRequest },
	0x65: { struct: PacketStructure.IN.ENTER, handler: AuthenticationEngine.onLoginRequest },

	//out
	0x69: { struct: PacketStructure.OUT.ACCEPT_LOGIN }
};