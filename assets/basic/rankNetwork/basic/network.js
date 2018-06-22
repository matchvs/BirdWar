/**
 * Created by leo on 2018/1/11.
 */

kf.addModule("basic.network", function() {
    var network = {};

    network.init = function() {
        this.netListener = kf.require("basic.eventListener").create();
    };

    network.chooseNetworkMode = function() {
        var realNetwork = kf.require("basic.networkForPomelo");
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

    network.on = function(msgName, handler) {
        this.netListener.on(msgName, handler);
    };

    network.dispatch = function(msgName, msgContent) {
        this.netListener.dispatch(msgName, msgContent);
    };
    return network;
});
