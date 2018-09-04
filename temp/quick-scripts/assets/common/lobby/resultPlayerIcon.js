(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/lobby/resultPlayerIcon.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '38706mPQDBCcq8qjMuqQHVj', 'resultPlayerIcon', __filename);
// common/lobby/resultPlayerIcon.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        icon: {
            default: null,
            type: cc.Sprite
        },

        nameLb: {
            default: null,
            type: cc.Label
        }
    },

    setData: function setData(id) {
        this.playerId = id;
        clientEvent.on(clientEvent.eventType.playerAccountGet, this.userInfoSet, this);
        Game.GameManager.userInfoReq(this.playerId);
    },

    userInfoSet: function userInfoSet(recvMsg) {
        if (recvMsg.account == this.playerId) {
            this.nameLb.string = recvMsg.userName;
            if (recvMsg.headIcon && recvMsg.headIcon !== "-") {
                cc.loader.load({ url: recvMsg.headIcon, type: 'png' }, function (err, texture) {
                    var spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                    if (this.icon) {
                        this.icon.spriteFrame = spriteFrame;
                    }
                }.bind(this));
            }
        }
    },

    onDestroy: function onDestroy() {
        clientEvent.off(clientEvent.eventType.playerAccountGet, this.userInfoSet, this);
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
        //# sourceMappingURL=resultPlayerIcon.js.map
        