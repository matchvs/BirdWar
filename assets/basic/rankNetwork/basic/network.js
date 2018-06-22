kf.addModule("basic.network", function() {
    var network = {};

    network.chooseNetworkMode = function() {
        var realNetwork = kf.require("basic.networkForPomelo");
        kf.require("basic.commonFunction").copyAllToTarget(realNetwork, this);
        this.initNetwork();
        if (this.pomelo) {
            for (var key in clientEvent) {
                this.pomelo["on"](key, this.onMessage);
            }
        }
    };

    network.on = function(msgName, handler) {
        clientEvent.on(msgName, handler);
    };

    network.dispatch = function(msgName, msgContent) {
        clientEvent.dispatch(msgName, msgContent);
    };
    return network;
});
