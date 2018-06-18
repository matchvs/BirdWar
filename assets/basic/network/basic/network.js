/**
 * Created by leo on 2018/1/11.
 */

kf.addModule("basic.network", function() {
    var network = {};

    network.init = function() {
        this.netListener = kf.require("basic.eventListener").create();
    };

    network.chooseNetworkMode = function() {
        var realNetwork;
        var constants = kf.require("shared.constants");
        realNetwork = kf.require("basic.networkForPomelo");

        var netListener = this.netListener;
        kf.require("basic.commonFunction").copyAllToTarget(realNetwork, this);
        this.initNetwork();
        this.netListener = netListener;
        if (this.pomelo) {
            for (var key in this.netListener) {
                this.pomelo["on"](key, this.onMessage);
            }
        }
    };

    // 留空。防止编辑器报错
    network.on = function(msgName, handler) {
        this.netListener.on(msgName, handler);
    };

    network.dispatch = function(msgName, msgContent) {
        this.netListener.dispatch(msgName, msgContent);
    };

    network.sendBattleRecordTest = function() {
        var BattleRecord = {};
        var positions = [];
        for (var j = 0; j < 100; j++) {
            var pos = {
                x: j,
                y: j
            }
            positions.push(pos);
        }
        var hero = {
            weaponType: 1,
            positions: positions
        }
        BattleRecord.hero = hero;
        BattleRecord.score = 288;
        var boomerangs = [];
        for (var i = 0; i < 10; i++) {
            var boomerang = {
                weaponType: i,
                positions: [{
                    x: i,
                    y: i
                }],
                spawnRound: i,
                isDestroy: i
            }
            boomerangs.push(boomerang);
        }
        BattleRecord.boomerangs = boomerangs;
        this.send("connector.battleRecordHandler.setBattleRecord", BattleRecord);
    };
    return network;
});
