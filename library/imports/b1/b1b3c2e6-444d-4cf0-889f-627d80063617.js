"use strict";
cc._RF.push(module, 'b1b3cLmRE1M8IifYn2ABjYX', 'item');
// game/script/item.js

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
        audioClip: {
            default: null,
            url: cc.AudioClip
        },
        _itemType: ItemType.None,
        itemType: {
            get: function get() {
                return this._itemType;
            },
            set: function set(value) {
                this._itemType = value;
            },

            type: ItemType
        }
    },
    playGetClip: function playGetClip() {
        cc.audioEngine.play(this.audioClip, false, 1);
    }
});

cc._RF.pop();