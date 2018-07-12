"use strict";
cc._RF.push(module, 'fb82d5Sr/1JnZbeK/r8ui/t', 'uiLogin');
// common/script/uiLogin.js

"use strict";

var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.nodeDict["start"].on("click", this.startGame, this);
    },
    startGame: function startGame() {
        Game.GameManager.matchVsInit();
    }
});

cc._RF.pop();