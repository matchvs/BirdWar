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
            var ip = "localhost";
            var port = "3010";
            this.connect(ip, port, function() {
                this.ip = ip;
                this.port = port;
                this.loginServer();
            }.bind(this));
        }
    },

    connect: function(ip, port, callback) {
        var socketUrl = port !== 0 ? "ws://" + ip + ":" + port : "ws://" + ip;
        if (this.web_socket) {
            this.web_socket.close();
        }
        this.web_socket = new WebSocket(socketUrl);
        this.web_socket.binaryType = "arraybuffer";
        cc.log("try to connect ws ", socketUrl);
        this.web_socket.onmessage = function(event) {
            callback();
        }.bind(this);

        this.web_socket.onopen = function(event) {
            cc.log("onopen------------");
            callback();
        }.bind(this);

        this.web_socket.onclose = function(event) {
            cc.log("onclose------------");
            this.web_socket = null;
            callback();
        }.bind(this);

        this.web_socket.onerror = function(event) {
            cc.log("onerror------------");
            callback();
        }.bind(this);

        return this;
    },

    loginServer: function() {
        this.network.send("connector.entryHandler.netTest", {});
    },

    send: function(msg, ignoreSession) {
        msg["sequence"] = [];
        msg["session"] = this.session;
        this.protobuf = require("msgType");
        var C2GS = this.protobuf["C2GS"];
        var c2gsMsg = new C2GS(msg);
        var encodeData = c2gsMsg["encode"]();
        var arrayBuffer = encodeData["toArrayBuffer"]();

        var err = this.web_socket.send(arrayBuffer);
        if (err) {
            console.log("err:" + err);
        }
    }
});
