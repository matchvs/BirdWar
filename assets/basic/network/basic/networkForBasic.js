/**
 * Created by john on 2018/01/08.
 */

kf.addModule("basic.networkForBasic", function() {
    var network = {};
    var clientEvent = kf.require("basic.clientEvent");
    var connectCallback = null;
    var closeCallback = null;

    network.initNetwork = function() {
        this.socket = kf.require("basic.socket");
        this.netListener = kf.require("basic.eventListener").create();
        this.clear();
        this.registerProto();
    };

    network.clear = function() {
        this.session = 1;
        this.internal_session = 1;
        this.socket.clearCallback();
    };

    network.registerProto = function() {
        this.protobuf = require("msgType");
        this.c2gs = this.protobuf.C2GS.$type;
        this.gs2c = this.protobuf.GS2C.$type;
    };

    network.connect = function(ip, port, cb) {
        if (this.isConnecting()) return;
        if (this.isConnected()) {
            if (cb) cb();
            return;
        }

        setTimeout(function() {
            try {
                this.socket.connect(ip, port, this.msgCallBack.bind(this));
                connectCallback = cb;
            } catch (e) {
                cc.log(e);
            }
        }.bind(this), 0);
    };

    network.msgCallBack = function(evenType, event) {
        switch (evenType) {
        case this.socket.eventType.onopen:
            if (connectCallback) {
                connectCallback();
                connectCallback = null;
            }
            break;

        case this.socket.eventType.onclose:
            this.clear();

            // 通知reconnect，网络断开
            this.dispatch("network close");
            if (closeCallback) {
                closeCallback();
                closeCallback = null;
            } else {
                var reconnectLogic = kf.require("basic.reconnect");
                if (reconnectLogic && !reconnectLogic.isInGame()) {
                    clientEvent.dispatchEvent("updateNetworkState", "networkError");
                }
            }

            break;

        case this.socket.eventType.onerror:
            break;

        case this.socket.eventType.onmessage:
            var data = event.data;
            var msg = this.protobuf["GS2C"]["decode"](data);
            var sequence = msg["sequence"];
            var newSession = msg["session"];
            if (newSession < 0) {
                // cc.log("Message error:" + msg);
                return;
            }

            if (!sequence || sequence.length === 0) {
                var loopArr = Object.keys(msg);
                for (var k = 0; k < loopArr.length; k++) {
                    var temp = loopArr[k];
                    if (msg[temp] === null || temp === "session" || temp === "sequence") continue;

                    var id = this.getIdByNameEx(temp);
                    sequence.push(id);
                }
            }

            var msgName;
            var msgContent;
            for (var i = 0; i < sequence.length; i++) {
                msgName = this.getNameByIdEx(sequence[i]);
                msgContent = msg[msgName];

                if (newSession === this.session) {
                    this.session = newSession + 1;
                    this.internal_session = this.session;
                }

                if (typeof (msgContent) === "object") {
                    // 过滤proto函数
                    var newMsg = {};
                    var keyArr = Object.keys(msgContent);
                    for (var key in keyArr) {
                        if (!keyArr.hasOwnProperty(key)) continue;
                        newMsg[keyArr[key]] = msgContent[keyArr[key]];
                    }
                    msgContent = newMsg;
                }
                cc.log("onmessage----" + msgName + " " + JSON.stringify(msgContent));
                this._convert2Number(msgContent);
                this.dispatch(msgName, msgContent);
            }

            break;
        default:
            break;
        }
    };

    network.isConnecting = function() {
        return this.socket.isConnecting();
    };

    network.isConnected = function() {
        return this.socket.isOpen();
    };

    network.isClosed = function() {
        return this.socket.isClosed();
    };

    network.isClosing = function() {
        return this.socket.isClosing();
    };

    network.disconnect = function(cb) {
        if (this.isConnected() || this.isConnecting()) {
            closeCallback = cb;
            this.socket.close();
        } else if (cb) {
            cb();
        }

        this.clear();
    };

    /**
     * 默认顺序发送
     * @param msg
     * @param ignoreSession
     * @returns {*}
     */
    network.send = function(msg, ignoreSession) {
        if (!this.isConnected()) {
            return -1;
        }

        if (!ignoreSession && this.session < this.internal_session) {
            cc.log("send fail", this.session, this.internal_session, msg);
            return -2;
        }
        cc.log("send-----", JSON.stringify(msg));

        var sequence = [];
        for (var key in msg) {
            if (!msg.hasOwnProperty(key)) continue;

            var id = this.getIdByName(key);
            if (id) sequence.push(id);
        }
        msg["sequence"] = sequence;

        if (!ignoreSession) {
            msg["session"] = this.session;
        } else {
            msg["session"] = 0;
        }

        var C2GS = this.protobuf["C2GS"];
        var c2gsMsg = new C2GS(msg);
        var encodeData = c2gsMsg["encode"]();
        var arrayBuffer = encodeData["toArrayBuffer"]();

        var err = this.socket.send(arrayBuffer);
        if (err) {
            // space
        } else if (!ignoreSession) {
            this.internal_session = this.internal_session + 1;
        }

        return err;
    };

    network.sendSeq = function(seq, ignoreSession) {
        var sequence = [];
        for (var i = 0; i < seq.length; i++) {
            var id = this.getIdByName(seq[i]);
            var msgVal = msg[seq[i]];
            if (id && msgVal) {
                sequence.push(id);
            }
        }

        this.send(sequence, ignoreSession);
        return err;
    };

    network.on = function(msgName, handler) {
        this.netListener.on(msgName, handler);
    };

    network.dispatch = function(msgName, msgContent) {
        this.netListener.dispatch(msgName, msgContent);
    };

    network.getIdByName = function(name) {
        if (!this.c2gs) return null;

        var child = this.c2gs["getChild"](name);
        if (child) return child.id;

        return null;
    };

    network.getNameById = function(id) {
        if (!this.c2gs) return null;

        var child = this.c2gs["getChild"](id);
        if (child) return child.name;

        return null;
    };

    network.getIdByNameEx = function(name) {
        if (!this.gs2c) return null;

        var child = this.gs2c["getChild"](name);
        if (child) return child.id;

        return null;
    };

    network.getNameByIdEx = function(id) {
        if (!this.gs2c) return null;

        var child = this.gs2c["getChild"](id);
        if (child) return child.name;

        return null;
    };

    network.clearCallback = function() {
        this.socket.clearCallback();
    };

    network._convert2Number = function(obj) {
        for (var a in obj) {
            var property = obj[a];

            var propertyType = typeof (property);
            if (this._isLong(property) && (a === "value" || a === "addValue" || a === "limit" ||
                a === "peopleTotal" || a === "selfDeath" || a === "selfWounded" ||
                a === "opponentDeath" || a === "opponentWounded")) {
                obj[a] = property.toNumber();
            } else if (property && propertyType === "object") {
                this._convert2Number(property);
            }
        }
    };

    network._isLong = function(obj) {
        return (obj && obj["__isLong__"]) === true;
    };

    return network;
});
