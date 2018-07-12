(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/uiTip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7960fhCqglNqaW5JWJ8/Tdi', 'uiTip', __filename);
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
        //# sourceMappingURL=uiTip.js.map
        