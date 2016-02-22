var Async      = require('async');
var NodeServer = require('../../server.js');

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

AuthenticationService.authenticateUser = function( userData, onUserAccepted, onUserRejected ) {
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
  * @this   {PACKET.OUT.ACCEPT_LOGIN}	Packet structure with user's login data
  * @param	{function}	onComplete		Function called when the method is complete  
*/
AuthenticationService.isClientVersionAllowed = function( onComplete ) {
	if(NodeServer.config.client.checkClientVersion && this.version != NodeServer.config.client.clientVersionToConnect) {
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
  * @this   {PACKET.OUT.ACCEPT_LOGIN}	Packet structure with user's login data
  * @param	{function}	onComplete		Function called when the method is complete
*/
AuthenticationService.isAccountRegistered = function( onComplete ) {
	if(!this.id || this.id == '' || this.id.length < 4) {
		onComplete({
			code: LOGIN_ERROR.UnregisteredId
		});
		return;
	}

	global._NODE.db
		.collection('login')
			.find({ userId: this.id }, function( err, docs ) {
				if(docs.length == 0) {
					onComplete({
						code: LOGIN_ERROR.UnregisteredId
					});
				}
				else {
					onComplete(null, docs[0]);
				}
			});

	return;
};

/**
  * Check user and password provided
  *
  * @this   {PACKET.OUT.ACCEPT_LOGIN}	Packet structure with user's login data
  * @param	{object}	userAccount		User's doc retrieved from database
  * @param	{function}	onComplete		Function called when the method is complete
*/
AuthenticationService.isUserAndPasswordValid = function( userAccount, onComplete ) {
	if(userAccount.password !== this.password) {
		return onComplete({
			code: LOGIN_ERROR.IncorrectPassword
		});
	}
	else {
		return onComplete(null, userAccount);
	}
};

//export
AuthenticationService.LOGIN_ERRORS = LOGIN_ERROR;
module.exports = AuthenticationService;