/**
 * Created by leo on 15/10/10.
 */

kf.addModule("basic.socket", function() {
    var socket = {
        web_socket: null,
        init: function() {

        },
        send: function(data) {
            if (this.isOpen()) {
                this.web_socket.send(data);
            }

            return null;
        },
        connect: function(ip, port, callback) {
            var socketUrl = port !== 0 ? "ws://" + ip + ":" + port : "ws://" + ip;
            if (this.web_socket) {
                this.web_socket.close();
            }

            this.web_socket = new WebSocket(socketUrl);
            this.web_socket.binaryType = "arraybuffer";

            cc.log("try to connect ws ", socketUrl);

            this.web_socket.onmessage = function(event) {
                callback(socket.eventType.onmessage, event);
            }.bind(this);

            this.web_socket.onopen = function(event) {
                cc.log("onopen------------");
                callback(socket.eventType.onopen, event);
            }.bind(this);

            this.web_socket.onclose = function(event) {
                cc.log("onclose------------");
                this.web_socket = null;

                callback(socket.eventType.onclose, event);
            }.bind(this);

            this.web_socket.onerror = function(event) {
                cc.log("onerror------------");
                callback(socket.eventType.onerror, event);
            }.bind(this);

            return this;
        },
        close: function() {
            if (!this.web_socket) {
                return;
            }

            this.web_socket.close();
            this.web_socket = null;
        },

        clearCallback: function() {
            if (!this.web_socket) return;
            this.web_socket.onMessage = null;
            this.web_socket.onopen = null;
            this.web_socket.onerror = null;
            this.web_socket.onclose = null;
        },

        isConnecting: function() {
            return (this.web_socket && this.web_socket.readyState === WebSocket.CONNECTING) || false;
        },

        isOpen: function() {
            return (this.web_socket && this.web_socket.readyState === WebSocket.OPEN) || false;
        },

        isClosed: function() {
            return (this.web_socket && this.web_socket.readyState === WebSocket.CLOSED) || true;
        },

        isClosing: function() {
            return (this.web_socket && this.web_socket.readyState === WebSocket.CLOSING) || true;
        }
    };

    socket.eventType = {
        "onmessage": 1,
        "onopen": 2,
        "onclose": 3,
        "onerror": 4
    };

    return socket;
});
