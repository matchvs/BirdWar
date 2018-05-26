// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        roomIdLb: {
            default: null,
            type: cc.Label
        }
    },

    start() {
        this.node.on("click", this.joinRoom, this);
    },

    setData: function(msRoomAttribute) {
        this.msRoomAttribute = msRoomAttribute;
        this.roomIdLb.string = msRoomAttribute.roomID;
    },

    joinRoom: function() {
        mvs.engine.joinRoom(this.msRoomAttribute.roomID, "joinRoomSpecial");
    }
});
