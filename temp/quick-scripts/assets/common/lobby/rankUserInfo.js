(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/lobby/rankUserInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6993eXRhERHfIGYXWslEfwS', 'rankUserInfo', __filename);
// common/lobby/rankUserInfo.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        rankCntLb: cc.Label,
        userNameLb: cc.Label,
        userIcon: cc.Sprite,
        userScoreLb: cc.Label
    },

    setData: function setData(data) {
        if (this.rankCntLb) {
            this.rankCntLb.string = data.rank;
        }
        this.userNameLb.string = data.userName;
        if (data.headIcon && data.headIcon !== "-") {
            cc.loader.load({ url: data.headIcon, type: 'png' }, function (err, texture) {
                // Use texture to create sprite frame
                var spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                this.userIcon.spriteFrame = spriteFrame;
            }.bind(this));
        }
        this.userScoreLb.string = data.score;
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
        //# sourceMappingURL=rankUserInfo.js.map
        