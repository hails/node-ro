var config = {
	/** MongoDB connection URL */
	connectionUrl: 'mongodb://localhost:27017/node-emulator',

	/** Store data as JSON files?
	  *
	  * Node Emulator can store data in JSON files if you don't have a MongoDB installation
	  * This should be only used for testing purposes.
	*/
	useJsonStore: false,

	/** JSON file name */
	jsonFileName: 'mongodb.js'
};

//export
module.exports = config;