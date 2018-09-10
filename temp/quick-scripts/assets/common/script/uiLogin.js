(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/uiLogin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb82d5Sr/1JnZbeK/r8ui/t', 'uiLogin', __filename);
// common/script/uiLogin.js

"use strict";

var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad: function onLoad() {
        this._super();
    },
    start: function start() {
        if (window.wx) {
            this.nodeDict["start"].active = false;
            wx.getSystemInfo({
                success: function success(data) {
                    Game.GameManager.getUserInfoBtn = wx.createUserInfoButton({
                        type: 'text',
                        text: '开始多人游戏',
                        style: {
                            left: data.screenWidth * 0.2,
                            top: data.screenHeight * 0.73,
                            width: data.screenWidth * 0.65,
                            height: data.screenHeight * 0.07,
                            lineHeight: data.screenHeight * 0.07,
                            backgroundColor: '#fe714a',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: data.screenHeight * 0.025,
                            borderRadius: 8
                        }
                    });
                    Game.GameManager.getUserInfoBtn.onTap(function (res) {
                        if (Game.GameManager.isClickCd) {
                            return;
                        }
                        Game.GameManager.isClickCd = true;
                        setTimeout(function () {
                            Game.GameManager.isClickCd = false;
                        }, 1000);
                        if (res.userInfo) {
                            Game.GameManager.nickName = res.userInfo.nickName;
                            Game.GameManager.avatarUrl = res.userInfo.avatarUrl;
                            Game.GameManager.matchVsInit();
                            Game.GameManager.getUserInfoBtn.hide();
                        }
                    });
                }
            });
        } else {
            this.nodeDict["start"].on("click", Game.GameManager.matchVsInit, Game.GameManager);
        }
    },
    onEnable: function onEnable() {
        if (Game.GameManager.getUserInfoBtn) {
            Game.GameManager.getUserInfoBtn.show();
        }
    },
    onDisable: function onDisable() {
        if (Game.GameManager.getUserInfoBtn) {
            Game.GameManager.getUserInfoBtn.hide();
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=uiLogin.js.map
        