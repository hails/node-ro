'use strict';

var MongoDB		= require('mongodb');
var DBConfig    = require('../configuration/database.js');

/**
  * Node Emulator Project
  *
  * Handles connections to MongoDB
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

/** MongoDB database object */
var _db = null;

/** MongoDB manager class */
class MongoManager {
    /** 
     * Creates a connection to MongoDB server
     * 
     * @param	{function}	onMongoReady    Function called when a connection to MongoDB is succesfully established
     */
    static init( onMongoReady ) {
        console.log("[ I ] Connecting to MongoDB...");
        
        MongoDB.MongoClient.connect(DBConfig.connectionUrl, function( err, db ) {
        	if(err) {
	            console.log("[ E ] MongoManager::Error while trying to connect to MongoDB. See logs for more details.".red);
	            return process.exit(1);        		
        	}
        	
        	_db = db;
            console.log("[ I ] Successfully connected to MongoDB!".green);
            
            return onMongoReady();	
        });
    }
    
    /** 
     * Returns a MongoDB database object
     * 
     * @returns {Object} 
     */    
    static getDatabase() {
        return _db;
    }
}

//export
exports.manager = MongoManager;
