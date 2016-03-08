'use strict';

var MongoDB = require('../infrastructure/mongoManager.js');

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
        this.accountId = 0;
        this.userId = userId;
        this.password = password;
        this.sex = sex;
        this.email = email;
    }
}

/** MongoDB Account collection name */
const AccountCollection = 'Account';

class AccountModel {
    static createAccount(userId, password, sex, email, callback) {
        var acc = new Account(userId, password, sex, email);
        
        MongoDB.manager.getDatabase()
            .collection(AccountCollection)
            .insert(acc, function( err, docs ) {
               handleError(err);
               
               return callback(docs || null);
            });
    }
    
    static findAccount(query, callback) {
        MongoDB.manager.getDatabase()
            .collection(AccountCollection)
            .findOne(query, function( err, docs ) {
                handleError(err);
                
                return callback(docs || null);
            });
    }
}

/** Log unexpected errors to console */
function handleError( err ) {
    if(err) {
        console.log("[ E ] AccountModel::An unexpected error ocurred. See logs for more details...".red);
    }
    
    return;
}

//export
module.exports = Account;