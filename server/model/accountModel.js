'use strict';

var MongoDB = require('../infrastructure/mongoManager.js');
var Logger = require('../utils/logger.js');

/**
  * Node Emulator Project
  *
  * User account model
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
  */

/** Account class */
class Account {
    constructor(userId, password, sex, email) {
        this._id = 0; //account ID
        this.userId = userId;
        this.password = password;
        this.sex = sex;
        this.email = email;
        this.level = 0;
        this.lastLoginTime = '';
        this.lastLoginIp = '';
    }
}

/** MongoDB Account collection constants */
const AccountCollection = 'accounts';
const AccountSequence = 'accountIdSeq';

class AccountModel {
    
    /**
     * Create a new user account
     * 
     * @param {String} userId Account's User ID
     * @param {String} password Account's password
     * @param {String} sex Account's sex
     * @param {String} email Account's email
     * @param {function} callback Callback function
    */ 
    static createAccount(userId, password, sex, email, callback) {
        var acc = new Account(userId, password, sex, email);
        
        MongoDB.manager
            .getNextSequence(AccountSequence, function( err, seqValue ) {
                if(err) {
                   Logger.error("AccountModel::Error while trying to generate account's sequence.");
                   process.exit(1);
                }
                
                acc._id = seqValue;
                
                MongoDB.manager.getDatabase()
                    .collection(AccountCollection)
                    .insert(acc, function( err, docs ) {
                       handleError(err);
                       
                       return callback(docs || null);
                    });
            });
    }
    
    /**
     * Query for an account on database by user ID
     * 
     * @param {String} _userId Account's User ID
     * @param {function} callback Callback function
    */ 
    static findByUserId(_userId, callback) {
        MongoDB.manager.getDatabase()
            .collection(AccountCollection)
            .findOne({ userId: _userId }, function( err, docs ) {
                handleError(err);
                
                return callback(docs || null);
            });
    }
}

/** Log unexpected errors to console */
function handleError( err ) {
    if(err) {
        Logger.error("AccountModel::An unexpected error ocurred: " + err.toString());
    }
    
    return;
}

//export
module.exports = AccountModel;