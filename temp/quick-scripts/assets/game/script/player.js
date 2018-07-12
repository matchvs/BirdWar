(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/game/script/player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd9a03bzstlEOYgcRxW+BPrj', 'player', __filename);
// game/script/player.js

"use strict";

var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        playerSp: {
            default: null,
            type: cc.Sprite
        },
        shieldSp: {
            default: null,
            type: cc.Sprite
        },
        explosionSp: {
            default: null,
            type: cc.Sprite
        },
        diedEffect: {
            default: null,
            type: cc.Node
        },
        firePoint: {
            default: null,
            type: cc.Node
        },
        smokePrefab: {
            default: null,
            type: cc.Prefab
        },
        deadClip: {
            default: null,
            url: cc.AudioClip
        },
        _camp: Camp.None,
        camp: {
            get: function get() {
                return this._camp;
            },
            set: function set(value) {
                this._camp = value;
            },

            type: Camp
        }
    },

    onLoad: function onLoad() {
        this.initPlayerFrame = this.playerSp.spriteFrame;
    },

    init: function init(userId) {
        this.gravity = 1500;
        this.currentSpeed = 0;
        this.flySpeed = 600;
        this.ceilY = 430;
        this.groundY = -580;
        this.userId = userId;
        this.isShield = false;
        this.isTrack = false;
        this.diedEffect.active = false;
        this.shieldSp.node.active = false;
        this.explosionSp.node.active = false;
        this.playerSp.spriteFrame = this.initPlayerFrame;
        this.anim = this.node.getComponent(cc.Animation);
        this.isDied = false;
        this.beChicken = false;
    },

    update: function update(dt) {
        this.currentSpeed -= dt * this.gravity;
        this.node.y += dt * this.currentSpeed;
        if (this.node.y < this.groundY) {
            this.node.y = this.groundY;
            if (this.isDied && !this.beChicken) {
                this.beChicken = true;
                this.anim.play("chicken");
            }
        }
        if (this.node.y > this.ceilY) {
            this.node.y = this.ceilY;
            this.currentSpeed = 0;
        }
    },

    getItem: function getItem(itemType) {
        var msg = {
            action: GLB.PLAYER_GET_ITEM_EVENT,
            itemType: itemType,
            playerId: this.userId
        };
        Game.GameManager.sendEventEx(msg);
    },

    getItemNotify: function getItemNotify(cpProto) {
        var itemType = cpProto.itemType;
        switch (itemType) {
            case ItemType.Shield:
                this.setShield(true);
                break;
            case ItemType.Track:
                this.setTrack(true);
                break;
            default:
                break;
        }
    },

    setShield: function setShield(active) {
        this.isShield = active;
        this.shieldSp.node.active = active;
    },

    setTrack: function setTrack(active) {
        this.isTrack = active;
    },

    removeItem: function removeItem(itemType) {
        var msg = {
            action: GLB.PLAYER_REMOVE_ITEM_EVENT,
            itemType: itemType
        };
        Game.GameManager.sendEventEx(msg);
    },

    removeItemNotify: function removeItemNotify(cpProto) {
        var itemType = cpProto.itemType;
        switch (itemType) {
            case ItemType.Shield:
                this.setShield(false);
                break;
            case ItemType.Track:
                this.setTrack(false);
                break;
            default:
                break;
        }
    },

    hurt: function hurt(murderId) {
        var msg = {
            action: GLB.PLAYER_HURT_EVENT,
            playerId: this.userId,
            murderId: murderId
        };
        Game.GameManager.sendEventEx(msg);
    },

    hurtNotify: function hurtNotify(murderId) {
        if (Game.GameManager.gameState !== GameState.Play) {
            return;
        }

        if (this.isShield) {
            this.setShield(false);
        } else {
            this.dead(murderId);
        }
    },

    dead: function dead(murderId) {
        this.isDied = true;

        this.shieldSp.node.active = false;
        this.anim.play('dead');
        cc.audioEngine.play(this.deadClip, false, 1);
        this.currentSpeed = -1000;
        if (Math.abs(this.node.y - this.groundY) < 5) {
            if (this.isDied && !this.beChicken) {
                this.beChicken = true;
                setTimeout(function () {
                    this.anim.play("chicken");
                }.bind(this), 1000);
            }
        }
        clientEvent.dispatch(clientEvent.eventType.playerDead, { Id: this.userId, murderId: murderId });
    },

    flyNotify: function flyNotify() {
        if (this.isDied === true) {
            return;
        }
        this.currentSpeed = this.flySpeed;
        this.anim.play();
        // smoke
        var smoke = cc.instantiate(this.smokePrefab);
        if (smoke) {
            var worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, -30));
            var localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
            smoke.parent = this.node.parent;
            smoke.position = localPos;
        }
    },

    fireNotify: function fireNotify(bulletPointY) {
        if (this.isDied) {
            return;
        }
        Game.BulletManager.spawnBullet(this, bulletPointY);
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
        //# sourceMappingURL=player.js.map
        