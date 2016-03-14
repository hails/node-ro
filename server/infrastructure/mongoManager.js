'use strict';

var MongoDB	= require('mongodb');
var DBConfig = require('../configuration/database.js');
var Logger = require('../utils/logger.js');

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
        Logger.info("Connecting to MongoDB...");
        
        MongoDB.MongoClient.connect(DBConfig.connectionUrl, function( err, db ) {
        	if(err) {
	            Logger.error("MongoManager::Error while trying to connect to MongoDB. See logs for more details.");
	            return process.exit(1);        		
        	}
        	
        	_db = db;
            Logger.success("Successfully connected to MongoDB!");
            
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
    
    /**
     * Updates a sequence and returns its new value
     * 
     * @param {String} seqName The name of the sequence
     * @param {function} callback Callback function
     * @returns {Number} Sequence's new value
    */ 
    static getNextSequence( seqName, callback ) {
        _db.collection('counters')
            .findAndModify(
                { "_id": seqName },
                { "$inc": { seq: 1 } },
                { new: true },
                function( err, doc ) {
                    if(err) {
                        return callback(err);
                    }
                    
                    return callback(null, doc._id);
                }
            );
    }
}

//export
exports.manager = MongoManager;
