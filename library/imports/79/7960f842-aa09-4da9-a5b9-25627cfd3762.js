"use strict";
cc._RF.push(module, '7960fhCqglNqaW5JWJ8/Tdi', 'uiTip');
// common/script/uiTip.js

"use strict";

var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad: function onLoad() {
        this._super();
        setTimeout(function () {
            if (this && this.node) {
                uiFunc.closeUI(this.node.name);
                this.node.destroy();
            }
        }.bind(this), 2000);
    },
    setData: function setData(content) {
        this.nodeDict["tipLb"].getComponent(cc.Label).string = content;
    }
});

cc._RF.pop();