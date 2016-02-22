'use strict';

/**
  * Node Emulator Project
  *
  * Authentication node class
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
  */
  
class AuthenticationNode {
    constructor() {
        this.authCode = 0;
        this.userLevel = 0;
        this.sex = 0;
        this.ip = 0;
        this.version = 0;
        this.clientType = 0;
    }
}

//export
module.exports = AuthenticationNode;