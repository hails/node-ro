'use strict';

var Packets = require('../packets/packetStructure.js');

/**
 * Node Emulator Project
 *
 * Common engine. Handles general packets
 *
 * @class CommonEngine
 * @static
 * @author Alvaro Bezerra <https://github.com/alvarodms>
*/
class CommonEngine {
    
    /**
     * Handles packet 0x187 - PING
     * Sent by client's TCP keep alive
     * 
     * @param {Object} pkt 0x187 packet structure
     * @param {Object} socket Client's socket
    */    
    static onPing( pkt, onResponseReady ) {
        var responsePkt = new Packets.PING();
        responsePkt.aid = 0;
        
        return onResponseReady(responsePkt);
    }
}