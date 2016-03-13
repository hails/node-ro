var Async = require('async');
var ClientConfig = require('../../configuration/client.js').client;
var FeaturesConfig = require('../../configuration/features.js').features;
var AccountModel = require('../../model/accountModel.js');

/**
 * Node Emulator Project
 *
 * User authentication services
 *
 * @author Alvaro Bezerra <https://github.com/alvarodms>
 */

var AuthenticationService = {};

const LOGIN_ERROR = {
	UnregisteredId: 0,				// 0 = Unregistered ID
	IncorrectPassword: 1,			// 1 = Incorrect Password
	AccountExpired: 2,				// 2 = This ID is expired
	RejectedFromServer: 3,			// 3 = Rejected from Server
	BlockedByGM: 4,					// 4 = You have been blocked by the GM Team
	NotLastestGameEXE: 5,			// 5 = Your Game's EXE file is not the latest version
	Banned: 6,						// 6 = Your are Prohibited to log in until %s
	ServerOverPopulation: 7,		// 7 = Server is jammed due to over populated
	AccountLimitFromCompany: 8,		// 8 = No more accounts may be connected from this company
	BanByDBA: 9,					// 9 = MSI_REFUSE_BAN_BY_DBA
	EmailNotConfirmed: 10,			// 10 = MSI_REFUSE_EMAIL_NOT_CONFIRMED
	BanByGM: 11,					// 11 = MSI_REFUSE_BAN_BY_GM
	WorkingInDB: 12,				// 12 = MSI_REFUSE_TEMP_BAN_FOR_DBWORK
	SelfLock: 13,					// 13 = MSI_REFUSE_SELF_LOCK
	NotPermittedGroup: 14,			// 14 = MSI_REFUSE_NOT_PERMITTED_GROUP
	NotPermittedGroup2: 15,			// 15 = MSI_REFUSE_NOT_PERMITTED_GROUP
	AccountGone: 99,				// 99 = This ID has been totally erased
	LoginInfoRemains: 100,			// 100 = Login information remains at %s
	HackingInvestigation: 101,		// 101 = Account has been locked for a hacking investigation. Please contact the GM Team for more information
	BugInvestigation: 102,			// 102 = This account has been temporarily prohibited from login due to a bug-related investigation
	DeletingChar: 103,				// 103 = This character is being deleted. Login is temporarily unavailable for the time being
	DeletingSpouseChar: 104			// 104 = This character is being deleted. Login is temporarily unavailable for the time being
};

AuthenticationService.authenticateUser = function authenticateUser( userData, onUserAccepted, onUserRejected ) {
	Async.waterfall([
		//TO DO: Check for DNS Blacklist

		AuthenticationService.isClientVersionAllowed
			.bind(userData),

		AuthenticationService.isAccountRegistered
			.bind(userData),

		AuthenticationService.isUserAndPasswordValid
			.bind(userData)

		//TO DO: Check if user is banned
	], function( err, results ) {
		if(err) {
			onUserRejected(err.code);
			return;
		}

		//account ok - login request accepted
		onUserAccepted(results);
	});
};

/**
 * Client version check
 *
 * @this {PACKET.OUT.LOGIN} Packet structure with user's login data
 * @param {function} onComplete	Function called when the method is complete  
 */
AuthenticationService.isClientVersionAllowed = function isClientVersionAllowed( onComplete ) {
	if(ClientConfig.checkClientVersion && this.version != ClientConfig.clientVersionToConnect) {
		onComplete({
			code: LOGIN_ERROR.NotLastestGameEXE
		});
	}
	else {
		onComplete();
	}

	return;
};

/**
 * Check if account is registered
 *
 * @this {PACKET.OUT.LOGIN} Packet structure with user's login data
 * @param {function} onComplete Function called when the method is complete
 */
AuthenticationService.isAccountRegistered = function isAccountRegistered( onComplete ) {
	if(!this.id || this.id == '' || this.id.length < 4) {
		return onComplete({
			code: LOGIN_ERROR.UnregisteredId
		});
	}
	
	AccountModel.findByUserId(this.id, function( acc ) {
		if(!acc) {
			if(FeaturesConfig.enableMFRegistration && isMFAccount(this.id)) {
				/** _M/_F registration is enabled, create a new account */
				AccountModel.createAccount(this.id, this.password, getMFAccountSex(this.id), 'a@a.com',
					function( newAcc ) {
						return onComplete(null, newAcc);
					});
			}
			else {
				/** Account not found */
				return onComplete({
					code: LOGIN_ERROR.UnregisteredId
				});	
			}
		}
		
		return onComplete(null, acc);
	});
};

/**
 * Check user and password provided
 *
 * @this {PACKET.OUT.LOGIN} Packet structure with user's login data
 * @param {Object} userAccount User's doc retrieved from database
 * @param {function} onComplete Function called when the method is complete
 */
AuthenticationService.isUserAndPasswordValid = function isUserAndPasswordValid( userAccount, onComplete ) {
	if(!userAccount || userAccount.password !== this.password) {
		return onComplete({
			code: LOGIN_ERROR.IncorrectPassword
		});
	}
	else {
		return onComplete(null, userAccount);
	}
};

/** 
 * Helper function
 * Checks if the userId ends with _M or _F
 * 
 * @param {String} userId User ID
 * @return {boolean} Returns true if userId ends with _M or _F
*/ 
function isMFAccount( userId ) {
	var lastTwo = userId.substr(userId.length-2);
	
	return lastTwo === "_M" || lastTwo === "_F";
}

/**
 * Helper function
 * Returns the sex of a _M/_F registered account
 * 
 * @param {String} userId User ID
 * @return {String} Returns the sex ('M' or 'F') of the account
*/ 
function getMFAccountSex( userId ) {
	return userId.charAt(userId.length-1);
}

//export
AuthenticationService.LOGIN_ERRORS = LOGIN_ERROR;
module.exports = AuthenticationService;