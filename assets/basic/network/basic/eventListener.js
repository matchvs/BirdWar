/**
 * Created by leo on 15/12/28.
 *
 * 事件处理类
 */

kf.addModule("basic.eventListener", function() {
    var oneTooOneListener = {};

    oneTooOneListener.on = function(eventName, handler) {
        if (this[eventName]) {
            console.error(eventName + "had already register");
        }

        this[eventName] = handler;
    };

    oneTooOneListener.dispatch = function(eventName/**/) {
        var handler = this[eventName];
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        if (handler) {
            try {
                handler.apply(this, args);
            } catch (e) {
                console.error(e);
            }
        } else {
            cc.log("not register " + eventName + "    callback func");
        }
    };

    var oneToMultiListener = {};

    oneToMultiListener.on = function(eventName, handler) {
        var handlerList = this.handlers[eventName];
        if (!handlerList) {
            handlerList = [];
            this.handlers[eventName] = handlerList;
        }

        for (var i = 0; i < handlerList.length; i++) {
            if (!handlerList[i]) {
                handlerList[i] = handler;
                return i;
            }
        }

        handlerList.push(handler);

        return handlerList.length;
    };

    oneToMultiListener.dispatch = function(eventName/**/) {
        var handlerList = this.handlers[eventName];

        var args = [];
        var i;
        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        if (!handlerList) {
            return;
        }

        var len = handlerList.length;
        for (i = 0; i < len; i++) {
            var handler = handlerList[i];
            if (handler) {
                try {
                    handler.apply(this, args);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    oneToMultiListener.off = function(eventName, handler) {
        var handlerList = this.handlers[eventName];

        if (!handlerList) {
            return;
        }

        for (var i = 0; i < handlerList.length; i++) {
            var oldHandler = handlerList[i];
            if (oldHandler === handler) {
                handlerList.splice(i, 1);
                break;
            }
        }
    };

    var eventListener = {};
    eventListener.create = function(type) {
        var newEventListener = {};

        if (type === "multi") {
            newEventListener = Object.create(oneToMultiListener);
            newEventListener.handlers = {};
        } else {
            newEventListener = Object.create(oneTooOneListener);
        }

        return newEventListener;
    };

    return eventListener;
});
