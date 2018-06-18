/**
 * Created by john on 2018/01/01.
 * 断线重连逻辑层
 * 如果丢失连接，重连服务器，三次失败之后，不再重连
 * 重连网络，还是重连游戏服务器
 * tips:在游戏中丢失连接时，重连才生效
 */

window.basic = window.basic || {};
basic.reconnect = function() {
    var network = kf.require("basic.network");
    var clientEvent = kf.require("basic.clientEvent");

    var reconnect = {};
    reconnect.init = function() {
        this.reset();

        network.on("reconnect timeout", function() {
            this.setLostConnection(true);
        }.bind(this));

        network.on("network close", function() {
            clientEvent.dispatchEvent("updateNetworkState", "onClose");
            this.setLostConnection(true);
        }.bind(this));
    };

    reconnect.reset = function() {
        this.interval = 5; // 断线检测时间间隔
        this.duration = this.interval; // 断线累计时间
        this.connectInterval = 3; // 尝试重连接服务器次数
        this.connectCount = 0; // 断线重连失败次数
        this.lostConnection = false; // 断线重连状态
    };

    reconnect.connectNetwork = function(dt) {
        if (!this.isInGame() || !this.isLostConnection() || network.isConnecting()) return;

        this.duration += dt;
        var delta = this.duration - this.interval;
        if (delta < 0) return;
        this.duration = delta;

        // clientEvent.dispatchEvent("showPanel", "netLoadingPanel");
        this._connect();
    };

    reconnect._connect = function() {
        if (this.connectCount >= this.connectInterval) {
            clientEvent.dispatchEvent("updateNetworkState", "reconnectFail");
            this.reset();
            network.dispatch("logout");
            return;
        }

        this.connectCount++;
        clientEvent.dispatchEvent("updateNetworkState", "connectServer");
        network.connect(this.ip, this.port, function() {
            // network.connectWithHost(this.ip, this.port, function () {
            this.reset();
            clientEvent.dispatchEvent("updateNetworkState", "connectServerSucc");
            clientEvent.dispatchEvent("hidePanel", "netLoadingPanel");
            network.dispatch("loginserver");
        }.bind(this));
    };

    reconnect.setLostConnection = function(flag) {
        if (flag) {
            if (!this.isInGame()) return;
            clientEvent.dispatchEvent("updateNetworkState", "connectServerLost");
            this.lostConnection = true;
            network.clearCallback();
        } else {
            this.lostConnection = false;
        }
    };

    reconnect.isLostConnection = function() {
        return this.lostConnection;
    };

    reconnect.isInGame = function() {
        return this.inGame;
    };

    reconnect.setInGame = function(flag) {
        // TODO 各游戏需要自行调用此接口
        this.inGame = flag;
    };

    reconnect.setServer = function(ip, port) {
        // TODO 各游戏需要自行调用此接口
        this.ip = ip;
        this.port = port;
    };

    return reconnect;
};
