"use strict";
cc._RF.push(module, '7c5b0PM5GxL454wtQ2uJEdQ', 'playerIcon');
// common/lobby/playerIcon.js

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
        playerSprite: {
            default: null,
            type: cc.Sprite
        },
        playerIconAnim: {
            default: null,
            type: cc.Animation
        }
    },
    setData: function setData(userInfo) {
        this.userInfo = userInfo;
        this.playerId = userInfo.id ? userInfo.id : userInfo.userId;
        this.playerSprite.node.active = true;
        Game.GameManager.userInfoReq(this.playerId);
    },

    init: function init() {
        this.playerId = 0;
        this.userInfo = null;
        this.playerSprite.node.active = false;
        clientEvent.on(clientEvent.eventType.playerAccountGet, this.userInfoSet, this);
    },

    userInfoSet: function userInfoSet(recvMsg) {
        if (recvMsg.account == this.playerId) {
            if (recvMsg.headIcon && recvMsg.headIcon !== "-") {
                cc.loader.load({ url: recvMsg.headIcon, type: 'png' }, function (err, texture) {
                    var spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                    this.playerSprite.spriteFrame = spriteFrame;
                }.bind(this));
            }
        }
    },

    onDestroy: function onDestroy() {
        clientEvent.off(clientEvent.eventType.playerAccountGet, this.userInfoSet, this);
    },


    reset: function reset() {
        this.playerIconAnim.node.active = false;
    },

    deadAnim: function deadAnim() {
        this.playerIconAnim.node.active = true;
        this.playerIconAnim.play();
    },

    onLoad: function onLoad() {
        this.init();
    }
});

cc._RF.pop();