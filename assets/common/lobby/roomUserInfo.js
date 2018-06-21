var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        userName: {
            default: null,
            type: cc.Label
        },
        ownerTag: {
            default: null,
            type: cc.Node
        },
        otherTag: {
            default: null,
            type: cc.Node
        },
        selfTag: {
            default: null,
            type: cc.Node
        },
        defaultNode: {
            default: null,
            type: cc.Node
        },
        commonNode: {
            default: null,
            type: cc.Node
        },
        kick: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        clientEvent.on(clientEvent.eventType.playerAccountGet, this.userInfoSet);
    },

    init: function() {
        this.defaultNode.active = true;
        this.otherTag.active = false;
        this.ownerTag.active = false;
        this.selfTag.active = false;
        this.userName.string = '';
        this.commonNode.active = false;
        this.kick.active = false;
        this.kick.on("click", this.kickPlayer, this);
        this.userId = 0;
    },

    setData: function(userId, ownerId) {
        this.userId = userId;
        if (this.userId === ownerId) {
            this.ownerTag.active = true;
            this.otherTag.active = false;
            this.selfTag.active = false;
        } else if (this.userId === GLB.userInfo.id) {
            this.ownerTag.active = false;
            this.otherTag.active = false;
            this.selfTag.active = true;
        } else {
            this.ownerTag.active = false;
            this.otherTag.active = true;
            this.selfTag.active = false;
        }
        this.defaultNode.active = false;
        this.commonNode.active = true;
        this.userName.string = this.userId;

        if (!GLB.isRoomOwner || this.userId === GLB.userInfo.id) {
            this.kick.active = false;
        } else {
            this.kick.active = true;
        }
        this.userInfoReq();
    },

    userInfoReq: function() {
        if (!Game.GameManager.network.isConnected()) {
            Game.GameManager.network.connect(GLB.IP, GLB.PORT, function() {
                    Game.GameManager.network.send("connector.entryHandler.login", {
                        "account": GLB.userInfo.id + "",
                        "channel": "0",
                        "userName": Game.GameManager.nickName ? Game.GameManager.nickName : GLB.userInfo.id + "",
                        "headIcon": Game.GameManager.avatarUrl ? Game.GameManager.avatarUrl : "-"
                    });
                    setTimeout(function() {
                        Game.GameManager.network.send("connector.entryHandler.findPlayerByAccount", {
                            "account": this.userId + "",
                        });
                    }, 200);
                }
            );
        } else {
            Game.GameManager.network.send("connector.entryHandler.findPlayerByAccount", {
                "account": this.userId + "",
            });
        }
    },

    userInfoSet: function(recvMsg) {
        console.log("recvMsg:" + recvMsg);
    },

    kickPlayer: function() {
        mvs.engine.kickPlayer(this.userId, "kick");
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.playerAccountGet, this.userInfoSet);
    }
});
