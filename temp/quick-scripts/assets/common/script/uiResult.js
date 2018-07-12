(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/uiResult.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f36ab+a3uVHprGY+tE/xnl0', 'uiResult', __filename);
// common/script/uiResult.js

"use strict";

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

    onLoad: function onLoad() {
        this._super();

        this.player1 = this.nodeDict["player1"].getComponent("resultPlayerIcon");
        this.player1.node.active = false;
        this.player2 = this.nodeDict["player2"].getComponent("resultPlayerIcon");
        this.player2.node.active = false;
        this.player3 = this.nodeDict["player3"].getComponent("resultPlayerIcon");
        this.player3.node.active = false;
        this.nodeDict["quit"].on("click", this.quit, this);
    },


    setData: function setData(data) {
        if (data.length > 0) {
            this.player1.setData(data[0]);
            this.player1.node.active = true;
            if (data.length > 1) {
                this.player2.setData(data[1]);
                this.player2.node.active = true;
            }
            if (data.length > 2) {
                this.player3.setData(data[2]);
                this.player3.node.active = true;
            }
        }
        if (data.loseCamp === Camp.Friend) {
            cc.audioEngine.play(this.victoryClip, false, 1);
        } else {
            cc.audioEngine.play(this.loseClip, false, 1);
        }
    },

    quit: function quit() {
        mvs.engine.leaveRoom("");
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            uiFunc.closeUI("uiGamePanel");
            gamePanel.destroy();
        }
        uiFunc.closeUI(this.node.name);
        this.node.destroy();

        Game.GameManager.lobbyShow();
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
        //# sourceMappingURL=uiResult.js.map
        