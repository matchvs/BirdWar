"use strict";
cc._RF.push(module, 'a7381zzskBJ4bDJQ9ArBMyG', 'uiExit');
// common/script/uiExit.js

"use strict";

var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.nodeDict["sure"].on("click", this.sure, this);
        this.nodeDict["close"].on("click", this.close, this);
    },
    close: function close() {
        uiFunc.closeUI(this.node.name);
        this.node.destroy();
    },
    sure: function sure() {
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