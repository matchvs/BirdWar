var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,

    properties: {},

    start() {
        this.nodeDict["randomRoom"].on("click", this.randomRoom, this);
        this.nodeDict["createRoom"].on("click", this.creatorRoom, this);
        this.nodeDict["joinRoom"].on("click", this.joinRoom, this);
        this.nodeDict["inviteFriend"].on("click", this.inviteFriend, this);
    },

    randomRoom: function(event) {
        GLB.matchType = GLB.RANDOM_MATCH; // 修改匹配方式为随机匹配
        console.log('开始随机匹配');
        uiFunc.openUI("uiRandomRoomPanel", function(obj) {
            var randomRoom = obj.getComponent("uiRandomRoomPanel");
            if (randomRoom) {
                randomRoom.joinRandomRoom();
            }
        });
    },

    creatorRoom: function(event) {
        var button = event.detail;
    },

    joinRoom: function(event) {
        var button = event.detail;
    },

    inviteFriend: function(event) {
        var button = event.detail;
    }
});
