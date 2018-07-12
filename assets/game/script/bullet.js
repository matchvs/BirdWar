var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0
    },

    init: function(hostPlayer, index, total, bulletPointY, bulletId) {
        this.bulletId = bulletId
        var offset = (index - ((total + 1) / 2)) * 40;
        this.hostPlayer = hostPlayer;
        this.node.parent = hostPlayer.node.parent;
        var worldPos = hostPlayer.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        var bulletPoint = hostPlayer.node.parent.convertToNodeSpaceAR(worldPos);
        this.node.position = cc.v2(bulletPoint.x, bulletPointY + offset);
        this.node.rotation = 0;
        this.speedY = 0;
        this.players = Game.PlayerManager.players;
    },

    onCollisionEnter: function(other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'bullet') {
            var bullet = other.node.getComponent('bullet');
            if (bullet && bullet.hostPlayer.camp !== this.hostPlayer.camp) {
                Game.BulletManager.recycleBullet(this);
            }
        } else if (group === 'player') {
            var player = other.node.getComponent('player');
            if (player && !player.isDied && player.camp !== this.hostPlayer.camp) {
                Game.BulletManager.recycleBullet(this);
                if (GLB.isRoomOwner) {
                    player.hurt(this.hostPlayer.userId);
                }
            }
        } else if (group === 'item') {
            Game.BulletManager.recycleBullet(this);
            var item = other.node.getComponent('item');
            if (item) {
                if (GLB.isRoomOwner) {
                    this.hostPlayer.getItem(item.itemType);
                }
                item.playGetClip();
            }
            other.node.active = false;
            other.node.destroy();
        }
    },

    update(dt) {
        if (this.hostPlayer.isTrack && this.players) {
            var targetPlayer = null;
            var playerScript = null;
            var minDistance = Number.MAX_VALUE;
            for (var i = 0; i < this.players.length; i++) {
                playerScript = this.players[i].getComponent('player');
                if (playerScript && playerScript.camp !== this.hostPlayer.camp) {
                    var selfPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
                    var targetPos = playerScript.node.convertToWorldSpaceAR(cc.v2(0, 0));
                    var distance = cc.pDistance(selfPos, targetPos);
                    if (distance < minDistance) {
                        targetPlayer = this.players[i];
                    }
                }
            }
            if (targetPlayer) {
                // 跟踪目标--
                playerScript = targetPlayer.getComponent('player');
                var pos;
                if (playerScript.camp === Camp.Enemy) {
                    pos = cc.v2(this.node.x - targetPlayer.x, this.node.y - targetPlayer.y);
                } else {
                    pos = cc.v2(targetPlayer.x - this.node.x, targetPlayer.y - this.node.y);
                }
                var rad = cc.pAngleSigned(pos, cc.v2(-1, 0));
                var angle = (180 / Math.PI) * rad;

                if (angle > 60) {
                    angle = 60;
                }
                if (angle < -60) {
                    angle = -60;
                }

                var rotation = cc.lerp(this.node.rotation, angle, dt);
                this.node.rotation = rotation;

                if (Math.abs(this.node.y - targetPlayer.y) > 1) {
                    if (this.node.y > targetPlayer.y) {
                        this.speedY -= Math.abs(this.speed * dt);
                    } else {
                        this.speedY += Math.abs(this.speed * dt);
                    }
                    this.node.setPositionY(this.node.position.y + (this.speedY * dt));
                }
                this.node.setPositionX(this.node.position.x + (this.speed * dt));
            } else {
                this.node.setPositionX(this.node.position.x + (this.speed * dt));
            }
        } else {
            this.node.setPositionX(this.node.position.x + (this.speed * dt));
        }
        if (Math.abs(this.node.position.x) > 360) {
            Game.BulletManager.recycleBullet(this);
        }
    }
})
;
