var MongoDB		= require('mongo-mock');
var DBConfig    = require('../configuration/database.js');

/**
  * Node Emulator Project
  *
  * Handles connections to MongoDB
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

var MongoClient = MongoDB.MongoClient;
MongoClient.persist = DBConfig.jsonFileName;

var ConnectionManager = function( onConnectionReady ) {
	console.log("[ I ] Connecting to MongoDB NoSQL Database...");

	MongoClient.connect(DBConfig.connectionUrl, function( err, db ) {
		if(err) {
			console.error("[ E ] ConnectionManager::Error while trying to connect to MongoDB. See logs for more details.".red);

			process.exit(1);
		}

		//MOCK
		var accounts = db.collection('login');
		accounts.insert({
			userId: 'alvarodms',
			password: 'abc123',
			sex: 'M',
			email: 'alvaro.dasmerces@gmail.com'
		}, function(){});

		console.log("[ I ] Successfully connected to database!".green);

		onConnectionReady(db);
	});
};

//export
module.exports = ConnectionManager;
