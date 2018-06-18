/**
 * Created by leo on 2017/11/11.
 */

kf.addModule("basic.configuration", function() {
    var configuration = {};

    var KEY_CONFIG = "kfConfig";

    configuration.init = function() {
        this.jsonData = {
            "account": "",
            "password": "",
            "serverIndex": 1
        };

        this.path = this.getConfigPath();

        var content;
        if (cc.sys.isNative) {
            var valueObject = jsb.fileUtils.getValueMapFromFile(this.path);

            content = valueObject[KEY_CONFIG];
        } else {
            content = cc.sys.localStorage.getItem(KEY_CONFIG);
        }

        // 解密代码
        if (cc.game.config["encript"]) {
            var newContent = new Xxtea("upgradeHeroAbility").xxteaDecrypt(content);
            if (newContent && newContent.length > 0) {
                content = newContent;
            }
        }

        if (content && content.length) {
            try {
                // 初始化操作
                var jsonData = JSON.parse(content);
                this.jsonData = jsonData;
            } catch (excepaiton) {
                // space
            }
        }
    };

    configuration.setConfigData = function(key, value) {
        var account = this.jsonData["account"];
        if (this.jsonData[account + this.jsonData["serverId"]]) {
            this.jsonData[account + this.jsonData["serverId"]][key] = value;
        } else {
            console.error("no account can not save");
        }
    };

    configuration.getConfigData = function(key) {
        var account = this.jsonData["account"];
        if (this.jsonData[account + this.jsonData["serverId"]]) {
            return this.jsonData[account + this.jsonData["serverId"]][key];
        }

        console.error("no account can not load");
        return "";
    };

    configuration.setGlobalData = function(key, value) {
        this.jsonData[key] = value;
    };

    configuration.getGlobalData = function(key) {
        return this.jsonData[key];
    };

    configuration.setAccountInfo = function(account, pwd, serverIndex) {
        this.jsonData["account"] = account;
        this.jsonData["password"] = pwd;
        if (typeof serverIndex !== "undefined") {
            this.jsonData["serverId"] = serverIndex;
        }


        if (!this.jsonData[account + this.jsonData["serverId"]]) {
            this.jsonData[account + this.jsonData["serverId"]] = {};
        }
    };

    configuration.getAccount = function() {
        return this.jsonData["account"];
    };

    configuration.save = function() {
        // 写入文件
        var str = JSON.stringify(this.jsonData);

        // 加密代码
        if (cc.game.config["encript"]) {
            str = new Xxtea("upgradeHeroAbility").xxteaEncrypt(str);
        }

        if (!cc.sys.isNative) {
            var ls = cc.sys.localStorage;
            ls.setItem(KEY_CONFIG, str);
            return;
        }

        var valueObj = {};
        valueObj[KEY_CONFIG] = str;
        jsb.fileUtils.writeToFile(valueObj, configuration.path);
    };

    configuration.getGuestAccount = function() {
        if (this.jsonData["guest_account"]) {
            return this.jsonData["guest_account"];
        }

        this.jsonData["guest_account"] = new Date().getTime() + "" + (0 | (Math.random() * 1000, 10));

        return this.jsonData["guest_account"];
    };

    configuration.setGuestAccount = function(acc) {
        this.jsonData["guest_account"] = acc;
    };

    configuration.getConfigPath = function() {
        var platform = cc.sys;

        var path = "";

        if (platform === cc.sys.OS_WINDOWS) {
            path = "src/conf";
        } else if (platform === cc.sys.OS_LINUX) {
            path = "./conf";
        } else if (cc.sys.isNative) {
            path = jsb.fileUtils.getWritablePath() + "conf";
        } else {
            path = "src/conf";
        }

        return path;
    };

    return configuration;
});
