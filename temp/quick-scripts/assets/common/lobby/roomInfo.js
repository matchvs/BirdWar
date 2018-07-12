(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/lobby/roomInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c337dIMd/tPPqIUQecSSWLa', 'roomInfo', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=roomInfo.js.map
        