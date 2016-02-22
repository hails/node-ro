/**
  * Node Emulator Project
  *
  * Client configuration
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

//export
module.exports = {
	client: {
		/**
		  * Check or not the clientversion set in clientinfo.xml?
		*/
		checkClientVersion: false,

		/**
	      * The clientversion allowed to connect. Any other version different from that will be rejected.
		*/
		clientVersionToConnect: 20
	}
};