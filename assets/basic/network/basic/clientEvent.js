
kf.addModule("basic.clientEvent", function() {
    var eventListener = kf.require("basic.eventListener");

    var clientEvent = {};
 
    var _EVENT_TYPE =
        [
            "testEvent",
            "showPanel",
            "hidePanel",

            "showNetLoading",
            "hideNetLoading",

            "updateNetworkState",
            "breakStars", // 消灭星星
            "restartGame", // 重新开始
            "loginSuccess",
            "recievedRankData",
            "pushTargetData",
            "gameOver"
        ];

    clientEvent.EVENT_TYPE = {};
    for (var i in _EVENT_TYPE) {
        var v = _EVENT_TYPE[i];
        clientEvent.EVENT_TYPE[v] = i;
    }

    clientEvent.init = function() {
        this.eventListener = eventListener.create("multi");
    };

    clientEvent.on = function(eventName, handler) {
        if (typeof eventName !== "string") {
            return;
        }

        eventName = clientEvent.EVENT_TYPE[eventName];

        this.eventListener.on(eventName, handler);
    };

    clientEvent.off = function(eventName, handler) {
        if (typeof eventName !== "string") {
            return;
        }

        eventName = clientEvent.EVENT_TYPE[eventName];

        this.eventListener.off(eventName, handler);
    };

    clientEvent.dispatchEvent = function(eventName /* arguments */) {
        if (typeof eventName !== "string") {
            return;
        }

        var eventIndex = clientEvent.EVENT_TYPE[eventName];

        if (!eventIndex) {
            cc.error("please add the event into clientEvent.js");
            return;
        }

        var newArgs = Array.prototype.slice.call(arguments);
        newArgs[0] = eventIndex;

        this.eventListener.dispatch.apply(this.eventListener, newArgs);
    };

    clientEvent.bindEventListener = function() {
        this.eventListener = eventListener.create("multi");
    };

    return clientEvent;
});
