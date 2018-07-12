"use strict";
cc._RF.push(module, '07e38UCzDFNWLMtMQvOMZOA', 'bulletManager');
// game/script/bulletManager.js

"use strict";

var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({

    extends: cc.Component,
    properties: {
        friendBulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        enemyBulletPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function onLoad() {
        Game.BulletManager = this;
        this.bulletId = 456489135745;
        // 子弹池--
        this.friendBulletPool = new cc.NodePool();
        this.enemyBulletPool = new cc.NodePool();
        clientEvent.on(clientEvent.eventType.roundStart, this.scheduleFire, this);
        clientEvent.on(clientEvent.eventType.roundOver, this.clearScheduleFire, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.clearScheduleFire, this);
    },


    clearScheduleFire: function clearScheduleFire() {
        if (GLB.isRoomOwner) {
            clearInterval(this.scheduleFireID);
        }
    },

    scheduleFire: function scheduleFire() {
        if (GLB.isRoomOwner) {
            console.log("fire");
            clearInterval(this.scheduleFireID);
            this.scheduleFireID = setInterval(function () {
                if (Game.GameManager.gameState === GameState.Over) {
                    clearInterval(this.scheduleFireID);
                    return;
                }
                var data = [];
                for (var j = 0; j < Game.PlayerManager.players.length; j++) {
                    var playerScript = Game.PlayerManager.players[j].getComponent("player");
                    if (playerScript) {
                        var worldPos = playerScript.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
                        var bulletPoint = playerScript.node.parent.convertToNodeSpaceAR(worldPos);
                        data.push({ playerId: playerScript.userId, bulletPointY: bulletPoint.y });
                    }
                }
                var msg = {
                    action: GLB.PLAYER_FIRE_EVENT,
                    data: data
                };
                Game.GameManager.sendEventEx(msg);
            }.bind(this), Game.fireInterval);
        }
    },

    spawnBullet: function spawnBullet(hostPlayer, bulletPointY) {
        var bulletCnt = Game.GameManager.curRound > 3 ? 3 : Game.GameManager.curRound;
        for (var i = 0; i < bulletCnt; i++) {
            var bulletObj = null;
            if (hostPlayer.camp === Camp.Enemy) {
                bulletObj = this.enemyBulletPool.get();
                if (!bulletObj) {
                    bulletObj = cc.instantiate(this.enemyBulletPrefab);
                }
            } else {
                bulletObj = this.friendBulletPool.get();
                if (!bulletObj) {
                    bulletObj = cc.instantiate(this.friendBulletPrefab);
                }
            }
            if (bulletObj) {
                var bulletScript = bulletObj.getComponent('bullet');
                if (bulletScript) {
                    bulletScript.init(hostPlayer, i + 1, bulletCnt, bulletPointY, this.bulletId);
                    this.bulletId++;
                }
            }
        }
    },

    recycleBullet: function recycleBullet(bulletScript) {
        if (bulletScript.hostPlayer.camp === Camp.Enemy) {
            this.enemyBulletPool.put(bulletScript.node);
        } else {
            this.friendBulletPool.put(bulletScript.node);
        }
    },

    onDestroy: function onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.scheduleFire, this);
        clientEvent.off(clientEvent.eventType.roundOver, this.clearScheduleFire, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.clearScheduleFire, this);
    }
});

cc._RF.pop();