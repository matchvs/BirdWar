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
    setData: function(userInfo) {
        this.userInfo = userInfo;
        this.playerId = userInfo.id ? userInfo.id : userInfo.userId;
        this.playerSprite.node.active = true;
    },

    init: function() {
        this.userInfo = null;
        this.playerSprite.node.active = false;
    },

    reset: function() {
        this.playerIconAnim.node.active = false;
    },

    deadAnim: function() {
        this.playerIconAnim.node.active = true;
        this.playerIconAnim.play();
    },

    onLoad() {
        this.init();
    }
});
