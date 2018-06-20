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
        rankCntLb: cc.Label,
        userNameLb: cc.Label,
        userIcon: cc.Sprite,
        userScoreLb: cc.Label
    },

    setData(data) {
        if (this.rankCntLb) {
            this.rankCntLb.string = data.rank;
        }
        this.userNameLb.string = data.userName;
        if (data.headIcon && data.headIcon !== "-") {
            cc.loader.load({url: data.headIcon, type: 'png'}, function(err, texture) {
                // Use texture to create sprite frame
                var spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                this.userIcon.spriteFrame = spriteFrame;
            }.bind(this));
        }
        this.userScoreLb.string = data.score;
    }
});
