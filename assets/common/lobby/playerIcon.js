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

        removeBtn: {
            default: null,
            type: cc.Button
        },

        playerName: {
            default: null,
            type: cc.Label

        },

        playerSprite: {
            default: null,
            type: cc.Sprite
        },

        defaultSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        }
    },
    setData: function(userInfo) {
        this.userInfo = userInfo;
        this.playerId = userInfo.id ? userInfo.id : userInfo.userId;
        this.playerName.string = userInfo.name ? userInfo.name : '' + this.playerId;
        var remoteUrl = "https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao" +
            "/wh%3D600%2C800/sign=d4d4da904990f60304e5944109229f23/9e3df8dcd100baa19347111a4410b912c8fc2e23.jpg";// userInfo.avatar;
        cc.loader.load(remoteUrl, function(err, texture) {
            if (this && this.playerSprite) {
                this.playerSprite.spriteFrame = new cc.SpriteFrame();
                this.playerSprite.spriteFrame.setTexture(texture);
            }
            // Use texture to create sprite frame
        }.bind(this));
    },

    init: function() {
        this.userInfo = null;
        this.playerName.string = "null";
        this.playerSprite.spriteFrame = this.defaultSpriteFrame;
    },

    start() {
        this.init();
    }

    // update (dt) {},
});
