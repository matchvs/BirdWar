var mvs = require("Matchvs");
var GLB = require("Glb");

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefabs: [cc.Prefab]
    },

    onLoad() {
        Game.ItemManager = this;
        clientEvent.on(clientEvent.eventType.roundStart, this.scheduleSpawnItem, this);
        clientEvent.on(clientEvent.eventType.roundOver, this.clearScheduleSpawn, this);
    },

    clearScheduleSpawn: function() {
        if (GLB.isRoomOwner) {
            clearInterval(this.scheduleSpawn);
        }
    },

    scheduleSpawnItem: function() {
        if (GLB.isRoomOwner) {
            this.scheduleSpawn = setInterval(function() {
                var index = dataFunc.randomNum(0, this.itemPrefabs.length - 1);
                var position = cc.v2(0, dataFunc.randomNum(-450, 350));
                var msg = {
                    action: GLB.NEW_ITEM_EVENT,
                    itemIndex: index,
                    position: position
                };
                Game.GameManager.sendEventEx(msg);
            }.bind(this), 5000);
        }
    },

    spawnItemNotify: function(cpProto) {
        if (this.item) {
            this.item.destroy();
        }
        this.item = cc.instantiate(this.itemPrefabs[cpProto.itemIndex]);
        this.item.parent = this.node;
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            var gamePanelScript = gamePanel.getComponent("uiGamePanel");
            if (gamePanelScript) {
                var parent = gamePanelScript.nodeDict["itemParent"];
                this.item.parent = parent;
                this.item.position = cpProto.position;
            }
        }
    },

    onDestroy: function() {
        if (GLB.isRoomOwner) {
            clientEvent.off(clientEvent.eventType.roundStart, this.scheduleSpawnItem, this);
            clientEvent.off(clientEvent.eventType.roundOver, this.clearScheduleSpawn, this);
        }
    }
});
