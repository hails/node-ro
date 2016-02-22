/**
  * Node Emulator Project
  *
  * Account pincode services
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
*/

var PincodeService = {};

const PINCODE_STATE = {
    PincodeOk: 0,
    PincodeAsk: 1,
    PincodeNotSet: 2,
    PincodeExpired: 3,
    PincodeUnused: 7,
    PincodeWrong: 8
};