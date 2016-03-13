var PacketStructure = require('./packetStructure.js');
var AuthenticationEngine = require('../engine/authenticationEngine.js');
var CharWindowEngine = require('../engine/characterSelectionEngine.js');
var CommonEngine = require('../engine/commonEngine.js');

/**
  * Node Emulator Project
  *
  * Link all packets ID to their respective structure and handler
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

//export
module.exports = {
	//Authentication
	0x64: { struct: PacketStructure.IN.LOGIN, handler: AuthenticationEngine.onAuthenticationRequest },
	0x65: { struct: PacketStructure.IN.ENTER, handler: AuthenticationEngine.onLoginRequest },
	0x69: { struct: PacketStructure.OUT.ACCEPT_LOGIN },
	
	//Character Window
	0x67: { struct: PacketStructure.IN.MAKE_CHAR, handler: CharWindowEngine.onCharCreateRequest },
	0x970: { struct: PacketStructure.IN.MAKE_CHAR2, handler: CharWindowEngine.onCharCreateRequest },
	
	//Common
	0x187: { struct: PacketStructure.PING, handler: CommonEngine.onPing }
};