"use strict";
cc._RF.push(module, 'c337dIMd/tPPqIUQecSSWLa', 'roomInfo');
// common/lobby/roomInfo.js

"use strict";

var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        roomIdLb: {
            default: null,
            type: cc.Label
        },
        roomNameLb: {
            default: null,
            type: cc.Label
        }
    },

    start: function start() {
        this.node.on("click", this.joinRoom, this);
    },


    setData: function setData(msRoomAttribute) {
        this.msRoomAttribute = msRoomAttribute;
        this.roomIdLb.string = msRoomAttribute.roomID;
        this.roomNameLb.string = msRoomAttribute.roomName;
    },

    joinRoom: function joinRoom() {
        mvs.engine.joinRoom(this.msRoomAttribute.roomID, "joinRoomSpecial");
    }
});

cc._RF.pop();