(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/game/script/playerManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5abc5w9mw1LQ4nMtJOjaNP1', 'playerManager', __filename);
// game/script/playerManager.js

"use strict";

var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        friendPrefabs: [cc.Prefab],
        enemyPrefabs: [cc.Prefab],
        friendPosX: 0,
        enemyPosX: 0
    },

    onLoad: function onLoad() {
        Game.PlayerManager = this;
        this.players = [];
        clientEvent.on(clientEvent.eventType.roundStart, this.initPlayers, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
    },


    gameOver: function gameOver() {
        this.players = [];
    },

    checkIsRoundOver: function checkIsRoundOver() {
        var enemyDiedCnt = 0;
        var friendDiedCnt = 0;
        for (var i = 0; i < this.players.length; i++) {
            var playerScript = this.players[i].getComponent('player');
            if (playerScript && playerScript.isDied) {
                if (playerScript.camp === Camp.Friend) {
                    friendDiedCnt++;
                } else {
                    enemyDiedCnt++;
                }
            }
        }
        if (enemyDiedCnt >= this.players.length / 2 || friendDiedCnt >= this.players.length / 2) {
            return true;
        }
        return false;
    },

    getLoseCamp: function getLoseCamp() {
        var enemyDiedCnt = 0;
        var friendDiedCnt = 0;
        for (var i = 0; i < this.players.length; i++) {
            var playerScript = this.players[i].getComponent('player');
            if (playerScript && playerScript.isDied) {
                if (playerScript.camp === Camp.Friend) {
                    friendDiedCnt++;
                } else {
                    enemyDiedCnt++;
                }
            }
        }
        var loseCamp = null;
        if (enemyDiedCnt >= this.players.length / 2 && friendDiedCnt >= this.players.length / 2) {
            loseCamp = Camp.None;
        } else if (enemyDiedCnt >= this.players.length / 2) {
            loseCamp = Camp.Enemy;
        } else if (friendDiedCnt >= this.players.length / 2) {
            loseCamp = Camp.Friend;
        }
        return loseCamp;
    },

    // 初始化玩家--
    initPlayers: function initPlayers() {
        var uiGamePanel = uiFunc.findUI("uiGamePanel");
        if (!uiGamePanel) {
            return;
        }
        var playerScript = null;
        if (this.players && this.players.length > 0) {
            for (var j = 0; j < this.players.length; j++) {
                playerScript = this.players[j].getComponent("player");
                if (playerScript) {
                    if (playerScript.camp === Camp.Friend) {
                        playerScript.position = cc.v2(this.friendPosX, -500);
                    } else {
                        playerScript.position = cc.v2(this.enemyPosX, -500);
                    }
                    playerScript.init(playerScript.userId);
                }
            }
        } else {
            var player = null;
            this.players = [];
            var campFlg = GLB.playerUserIds.length / 2;
            for (var i = 0; i < GLB.playerUserIds.length; i++) {
                if (i < campFlg) {
                    // 友方
                    player = cc.instantiate(this.friendPrefabs[i]);
                    player.parent = uiGamePanel;
                    player.position = cc.v2(this.friendPosX, -500);
                } else {
                    // 敌方
                    player = cc.instantiate(this.enemyPrefabs[i - campFlg]);
                    player.parent = uiGamePanel;
                    player.position = cc.v2(this.enemyPosX, -500);
                }
                playerScript = player.getComponent("player");
                if (playerScript) {
                    playerScript.init(GLB.playerUserIds[i]);
                }
                this.players.push(player);
            }
            this.players[0].setLocalZOrder(999);
        }
    },

    getPlayerByUserId: function getPlayerByUserId(userId) {
        for (var i = 0; i < GLB.playerUserIds.length; i++) {
            if (GLB.playerUserIds[i] === userId && this.players && this.players[i]) {
                return this.players[i].getComponent("player");
            }
        }
        return null;
    },

    onDestroy: function onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.initPlayers, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
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
        //# sourceMappingURL=playerManager.js.map
        