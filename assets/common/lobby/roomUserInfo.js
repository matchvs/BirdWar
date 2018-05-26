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
    },

    kickPlayer: function() {
        mvs.engine.kickPlayer(this.userId, "kick");
    }
});
