var mvs = require("Matchvs");
var GLB = require("Glb");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    properties: {
        hitClip: {
            default: null,
            url: cc.AudioClip
        },
        hitByClip: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad() {
        this._super();
        this.playerHearts = this.nodeDict["playerHeartLayout"].children;
        this.enemyHearts = this.nodeDict["enemyHeartLayout"].children;
        this.countDownLb = this.nodeDict["countDownLb"].getComponent(cc.Label);
        this.node.on(cc.Node.EventType.TOUCH_START, this.fly, this);
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.playerDead, this.playerDead, this);
        clientEvent.on(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.timeOver, this.timeOver, this);
        clientEvent.on(clientEvent.eventType.leaveRoomNotifyMed, this.leaveRoom, this);

        this.nodeDict["exit"].on("click", this.exit, this);
        this.playerIcons = [];
        this.playerIcons.push(this.nodeDict["player1Icon"].getComponent("playerIcon"));
        this.playerIcons.push(this.nodeDict["player2Icon"].getComponent("playerIcon"));
        this.playerIcons.push(this.nodeDict["enemy1Icon"].getComponent("playerIcon"));
        this.playerIcons.push(this.nodeDict["enemy2Icon"].getComponent("playerIcon"));
    },

    leaveRoom(data) {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    var friends = Game.GameManager.friendIds.filter(function(x) {
                        return x === data.leaveRoomInfo.userId;
                    });
                    if (friends.length > 0) {
                        uiTip.setData("队友离开了游戏");
                    } else {
                        uiTip.setData("对手离开了游戏");
                    }
                }
            }.bind(this));
        }
    },

    exit() {
        uiFunc.openUI("uiExit");
    },

    start() {
        if (GLB.MAX_PLAYER_COUNT === 2) {
            this.nodeDict["player2Icon"].active = false;
            this.nodeDict["enemy2Icon"].active = false;
            this.nodeDict["player1Icon"].getComponent("playerIcon").setData({ id: GLB.playerUserIds[0] });
            this.nodeDict["enemy1Icon"].getComponent("playerIcon").setData({ id: GLB.playerUserIds[1] });
        } else {
            this.nodeDict["player1Icon"].getComponent("playerIcon").setData({ id: GLB.playerUserIds[0] });
            this.nodeDict["player2Icon"].getComponent("playerIcon").setData({ id: GLB.playerUserIds[1] });
            this.nodeDict["enemy1Icon"].getComponent("playerIcon").setData({ id: GLB.playerUserIds[2] });
            this.nodeDict["enemy2Icon"].getComponent("playerIcon").setData({ id: GLB.playerUserIds[3] });
        }
    },

    playerDead: function(data) {
        if (data.murderId === GLB.userInfo.id) {
            this.nodeDict["hit"].getComponent(cc.Animation).play();
            cc.audioEngine.play(this.hitClip, false, 1);
        } else if (data.Id === GLB.userInfo.id && data.murderId) {
            this.nodeDict["hitBy"].getComponent(cc.Animation).play();
            cc.audioEngine.play(this.hitByClip, false, 1);
        }
        for (var i = 0; i < this.playerIcons.length; i++) {
            if (this.playerIcons[i].playerId === data.Id) {
                this.playerIcons[i].deadAnim();
            }
        }
    },

    gameOver: function() {
        this.nodeDict['gameOver'].getComponent(cc.Animation).play();
        this.nodeDict['gameOver'].getComponent(cc.AudioSource).play();
        clearInterval(this.countDownInterval);
    },

    timeOver: function() {
        this.nodeDict['timeOver'].getComponent(cc.Animation).play();
        this.nodeDict['timeOver'].getComponent(cc.AudioSource).play();
        clearInterval(this.countDownInterval);
    },

    roundStart: function() {
        // 回合画面表现--
        for (var i = 0; i < this.playerIcons.length; i++) {
            this.playerIcons[i].reset();
        }
        this.countDown();
        var curRound = Game.GameManager.curRound;
        this.nodeDict['roundCntLb'].getComponent(cc.Label).string = curRound.toString();
        this.nodeDict['roundStart'].getComponent(cc.Animation).play();
        this.nodeDict['rope'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.AudioSource).play();
    },

    countDown: function() {
        clearInterval(this.countDownInterval);
        var times = Game.roundSeconds;
        this.countDownLb.string = times;
        this.countDownInterval = setInterval(function() {
            times--;
            if (times < 0) {
                clearInterval(this.countDownInterval);
                if (GLB.isRoomOwner) {
                    this.timeOverMsg();
                }
            } else if (Game.GameManager.gameState !== GameState.Play) {
                clearInterval(this.countDownInterval);
            } else {
                this.countDownLb.string = times;
            }
            if (times === 10) {
                this.nodeDict["clock"].getComponent(cc.Animation).play();
            }
        }.bind(this), 1000);
    },

    timeOverMsg: function() {
        var msg = {
            action: GLB.TIME_OVER
        };
        Game.GameManager.sendEventEx(msg);
    },

    roundOver: function() {
        var i;
        for (i = 0; i < this.playerHearts.length; i++) {
            if (i < Game.GameManager.friendHearts) {
                this.playerHearts[i].active = true;
            } else {
                this.playerHearts[i].active = false;
            }
        }
        for (i = 0; i < this.enemyHearts.length; i++) {
            if (i < Game.GameManager.enemyHearts) {
                this.enemyHearts[i].active = true;
            } else {
                this.enemyHearts[i].active = false;
            }
        }
        clearInterval(this.countDownInterval);
    },

    fly: function() {
        if (Game.GameManager.gameState !== GameState.Play) {
            return;
        }
        var player = Game.PlayerManager.getPlayerByUserId(GLB.userInfo.id);
        if (!player || player.isDied) {
            return;
        }
        var msg = {
            action: GLB.PLAYER_FLY_EVENT
        };
        Game.GameManager.sendEventEx(msg);
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.off(clientEvent.eventType.playerDead, this.playerDead, this);
        clientEvent.off(clientEvent.eventType.timeOver, this.timeOver, this);
        clientEvent.off(clientEvent.eventType.leaveRoomNotifyMed, this.leaveRoom, this);

    }
});
