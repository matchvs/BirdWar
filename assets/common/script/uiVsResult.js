var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,

    properties: {
        loseClip: {
            default: null,
            url: cc.AudioClip
        },
        victoryClip: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad() {
        this._super();
        this.player = this.nodeDict["player"].getComponent("resultPlayerIcon");
        this.player.node.active = false;
        this.rival = this.nodeDict["rival"].getComponent("resultPlayerIcon");
        this.rival.node.active = false;
        this.nodeDict["quit"].on("click", this.quit, this);
    },

    quit: function() {
        mvs.engine.leaveRoom("");
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            uiFunc.closeUI("uiGamePanel");
            gamePanel.destroy();
        }
        uiFunc.closeUI(this.node.name);
        this.node.destroy();

        Game.GameManager.lobbyShow();
    },

    setData(data) {
        for (var i = 0; i < data.friendIds.length; i++) {
            var ins = cc.instantiate(this.player.node);
            ins.active = true;
            ins.parent = this.player.node.parent;
            var script = ins.getComponent("resultPlayerIcon");
            script.setData(data.friendIds[i]);
        }

        for (var i = 0; i < data.enemyIds.length; i++) {
            var ins = cc.instantiate(this.rival.node);
            ins.active = true;
            ins.parent = this.rival.node.parent;
            var script = ins.getComponent("resultPlayerIcon");
            script.setData(data.enemyIds[i]);
        }

        var isWin = data.selfScore > data.rivalScore;
        this.nodeDict["lose"].active = !isWin;
        this.nodeDict["win"].active = isWin;
        if (isWin) {
            cc.audioEngine.play(this.victoryClip, false, 1);
        } else {
            cc.audioEngine.play(this.loseClip, false, 1);
        }

        if (data.selfScore || data.rivalScore) {
            this.nodeDict["vs"].active = false;
            this.nodeDict["score"].active = true;

            this.nodeDict["playerScore"].getComponent(cc.Label).string = data.selfScore;
            this.nodeDict["rivalScore"].getComponent(cc.Label).string = data.rivalScore;
        } else {
            this.nodeDict["vs"].active = true;
            this.nodeDict["score"].active = false;
        }

        if (isWin) {
            // 发送胜局记录--
            Game.GameManager.loginServer();
        }
    }
});
