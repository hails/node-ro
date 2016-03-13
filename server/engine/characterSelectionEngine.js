'use strict';

/**
 * Node Emulator Project
 *
 * Character selection engine. Handles all character selection/creation related packets
 *
 * @class CharacterSelectionEngine
 * @static
 * @author Alvaro Bezerra <https://github.com/alvarodms>
*/
class CharacterSelectionEngine {
    /**
     * Handles packet 0x67 / 0x970 - MAKE_CHAR
     * Sent by client when the user request a creation of a new character
     * 
     * @param {Object} pkt 0x67 or 0x970 packet structure
     * @param {Object} socket Client's socket
    */
    static onCharCreateRequest( pkt, onResponseReady ) {
        
    }
}