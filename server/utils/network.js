/**
  * Node Emulator Project
  *
  * Network helper functions
  * Thanks to StackExchange community for ipToLong() <http://codereview.stackexchange.com/questions/54775/converting-an-ip>
  * 
  * @author Alvaro Bezerra <alvaro.dasmerces@gmail.com>
*/

//Fix me: maybe we should not use RegExp for better performance?
var _ipToLong = (function() {
    var octet = '([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])';
    var ipRegExp = new RegExp('^' + octet + '\.' + octet + '\.' + octet + '\.' + octet + '$');

    return function ipToLong(string) {
        var octets = string.match(ipRegExp);
        if (octets === null) {
            throw 'Invalid IPv4 address!';
        } else {
            // @Lucien and @Corbin are right! The right-shift operators
            // prevent (128 << 24) from being interpreted as a negative
            // number.
            return ((octets[1] << 24) >>> 0) +
                   ((octets[2] << 16) >>> 0) +
                   ((octets[3] <<  8) >>> 0) +
                   (octets[4] <<  0);
        }
    };
})();

//export
module.exports = {
	ipToLong: _ipToLong
};