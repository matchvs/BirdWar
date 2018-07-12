(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/uiLobbyPanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a5e20CGbKhAx5GXgmsgxPm/', 'uiLobbyPanel', __filename);
// common/script/uiLobbyPanel.js

"use strict";

var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,

    properties: {},

    start: function start() {
        this.nodeDict["randomRoom"].on("click", this.randomRoom, this);
        this.nodeDict["createRoom"].on("click", this.createRoom, this);
        this.nodeDict["joinRoom"].on("click", this.joinRoom, this);
        this.nodeDict["inviteFriend"].on("click", this.inviteFriend, this);
        this.nodeDict["exit"].on("click", this.exit, this);
        if (Game.GameManager.nickName) {
            this.nodeDict["name"].getComponent(cc.Label).string = Game.GameManager.nickName;
        } else {
            this.nodeDict["name"].getComponent(cc.Label).string = GLB.userInfo.id;
        }
        if (Game.GameManager.avatarUrl) {
            cc.loader.load({ url: Game.GameManager.avatarUrl, type: 'png' }, function (err, texture) {
                var spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                this.nodeDict["userIcon"].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }.bind(this));
        }

        if (!Game.GameManager.network.isConnected()) {
            Game.GameManager.network.connect(GLB.IP, GLB.PORT, function () {
                Game.GameManager.network.send("connector.entryHandler.login", {
                    "account": GLB.userInfo.id + "",
                    "channel": "0",
                    "userName": Game.GameManager.nickName ? Game.GameManager.nickName : GLB.userInfo.id + "",
                    "headIcon": Game.GameManager.avatarUrl ? Game.GameManager.avatarUrl : "-"
                });
            });
        }
        this.nodeDict["rank"].on("click", this.rank, this);
    },


    rank: function rank() {
        if (!Game.GameManager.network.isConnected()) {
            Game.GameManager.network.connect(GLB.IP, GLB.PORT, function () {
                Game.GameManager.network.send("connector.entryHandler.login", {
                    "account": GLB.userInfo.id + "",
                    "channel": "0",
                    "userName": Game.GameManager.nickName ? Game.GameManager.nickName : GLB.userInfo.id + "",
                    "headIcon": Game.GameManager.avatarUrl ? Game.GameManager.avatarUrl : "-"
                });
                setTimeout(function () {
                    Game.GameManager.network.send("connector.rankHandler.getRankData", {
                        "account": GLB.userInfo.id + "",
                        "game": "game0"
                    });
                }, 500);
            });
        } else {
            Game.GameManager.network.send("connector.rankHandler.getRankData", {
                "account": GLB.userInfo.id + "",
                "game": "game0"
            });
        }
    },

    exit: function exit() {
        mvs.engine.logout("");
        uiFunc.closeUI(this.node.name);
        this.node.destroy();
    },

    onEnable: function onEnable() {
        GLB.isRoomOwner = false;
        GLB.MAX_PLAYER_COUNT = 4;
    },


    randomRoom: function randomRoom() {
        GLB.matchType = GLB.RANDOM_MATCH; // 修改匹配方式为随机匹配
        console.log('开始随机匹配');
        if (GLB.gameType === GLB.COOPERATION) {
            if (GLB.MAX_PLAYER_COUNT > 1) {
                if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
                    uiFunc.openUI("uiMatchingVer", function (obj) {
                        var matching = obj.getComponent("uiMatching");
                        matching.joinRandomRoom();
                    });
                } else {
                    uiFunc.openUI("uiMatching", function (obj) {
                        var matching = obj.getComponent("uiMatching");
                        matching.joinRandomRoom();
                    });
                }
            } else {
                cc.director.loadScene('game');
            }
        } else if (GLB.gameType === GLB.COMPETITION) {
            if (GLB.MAX_PLAYER_COUNT === 2) {
                if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
                    uiFunc.openUI("uiMatching1v1Ver", function (obj) {
                        var matching = obj.getComponent("uiMatching1v1Ver");
                        matching.joinRandomRoom();
                    });
                } else {
                    uiFunc.openUI("uiMatching1v1", function (obj) {
                        var matching = obj.getComponent("uiMatching1v1");
                        matching.joinRandomRoom();
                    });
                }
            } else if (GLB.MAX_PLAYER_COUNT === 4) {
                if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
                    uiFunc.openUI("uiMatching2v2Ver", function (obj) {
                        var matching = obj.getComponent("uiMatching2v2Ver");
                        matching.joinRandomRoom();
                    });
                } else {
                    uiFunc.openUI("uiMatching2v2Ver", function (obj) {
                        var matching = obj.getComponent("uiMatching2v2Ver");
                        matching.joinRandomRoom();
                    });
                }
            }
        }
    },

    createRoom: function createRoom() {
        if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
            uiFunc.openUI("uiCreateRoomVer");
        } else {
            uiFunc.openUI("uiCreateRoom");
        }
    },

    joinRoom: function joinRoom() {
        if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
            uiFunc.openUI("uiRoomListVer");
        } else {
            uiFunc.openUI("uiRoomList");
        }
    },

    inviteFriend: function inviteFriend() {
        wx.shareAppMessage();
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
        //# sourceMappingURL=uiLobbyPanel.js.map
        