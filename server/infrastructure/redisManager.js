'use strict';

var Redis = require('redis');
var DBConfig = require('../configuration/database.js');
var Logger = require('../utils/logger.js');

/**
  * Node Emulator Project
  *
  * Handles connections to Redis Server
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
  */

/** Redis databases enum */
const databases = {
  AUTH_DB: 0
};

/** Redis client */
var client = null;

/** Redis manager class */
class RedisManager {
    /**
     * Creates a connection to Redis server
     *
     * @param	{function}	onRedisReady    Function called when a connection to Redis server is succesfully established
     */
    static init( onRedisReady ) {
        Logger.info("Connecting to Redis server...");

        client = Redis.createClient({ host: DBConfig.redisAddress, port: DBConfig.redisPort });

        client.on('connect', function() {
            Logger.log("Successfully connected to Redis server!");
            return onRedisReady();
        });

        client.on('error', function() {
            Logger.error("RedisManager::Error while trying to connect to Redis server. See logs for more details.");
            return process.exit(1);
        });
    }

    /**
     * Returns a Redis client object
     *
     * @returns {Object}
     */
    static getClient() {
        return client;
    }
}

//export
exports.databases = databases;
exports.manager = RedisManager;
