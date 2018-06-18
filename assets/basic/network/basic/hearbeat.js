/**
 * Created by john on 2018/01/08.
 * 心跳包逻辑层
 * 启动后生效，关闭或者丢失连接时无效
 */

kf.addModule("basic.heartbeat", function() {
    var heartbeat = {};

    var clientEvent = kf.require("basic.clientEvent");
    var network = kf.require("basic.network");
    var reconnet = kf.require("basic.reconnect");

    heartbeat.init = function() {
        this.reset();

        network.on("heartBeatRet", function() {
            clientEvent.dispatchEvent("updateNetworkState", "heartBeatRet");
            this.heartBeatDuration = 0;
        }.bind(this));
    };

    heartbeat.reset = function() {
        this.heartBeatDuration = 0; // 心跳包未响应累计时间，单位秒
        this.heartBeatTimeout = 15; // 心跳包未响应超时时间，单位秒
        this.interval = 5; // 心跳检测时间间隔
        this.duration = this.interval; // 心跳检测累计时间
    };

    heartbeat.start = function() {
        clientEvent.dispatchEvent("updateNetworkState", "startCheck");
        this.check = true;
    };

    heartbeat.stop = function() {
        clientEvent.dispatchEvent("updateNetworkState", "stopCheck");
        this.check = false;
    };

    heartbeat.checkNetwork = function(dt) {
        if (!this.check || reconnet.isLostConnection()) return;

        this.duration += dt;
        var delta = this.duration - this.interval;
        if (delta < 0) return;
        this.duration = delta;
        this.heartBeatDuration += this.interval;
        if (this.heartBeatDuration >= this.heartBeatTimeout + 1) {
            clientEvent.dispatchEvent("updateNetworkState", "heartBeatNoRet");
            this.heartBeatDuration = 0;
            // 向reconnect发送心跳超时消息
            network.dispatch("reconnect timeout");
            network.disconnect();
        } else {
            var ret = network.send({ "heartBeat": {} }, true);
            if (!ret) {
                clientEvent.dispatchEvent("updateNetworkState", "heartBeatSend");
            }
        }
    };

    return heartbeat;
});
