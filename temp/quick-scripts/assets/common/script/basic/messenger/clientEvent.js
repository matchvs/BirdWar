(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/basic/messenger/clientEvent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '771d9tmDfZB9b/EtuKXDtNa', 'clientEvent', __filename);
// common/script/basic/messenger/clientEvent.js

"use strict";

window.clientEvent = {
    eventType: {
        openUI: "openUI",
        closeUI: "closeUI",
        gameStart: "gameStart",
        gameOver: "gameOver",
        timeOver: "timeOver",
        roundOver: "roundOver",
        roundStart: "roundStart",
        playerDead: "playerDead",

        initResponse: "initResponse",
        errorResponse: "errorResponse",
        joinRoomResponse: "joinRoomResponse",
        joinRoomNotify: "joinRoomNotify",
        leaveRoomResponse: "leaveRoomResponse",
        leaveRoomNotify: "leaveRoomNotify",
        leaveRoomNotifyMed: "leaveRoomNotifyMed",
        joinOverResponse: "joinOverResponse",
        createRoomResponse: "createRoomResponse",
        getRoomListResponse: "getRoomListResponse",
        getRoomDetailResponse: "getRoomDetailResponse",
        getRoomListExResponse: "getRoomListExResponse",
        kickPlayerResponse: "kickPlayerResponse",
        kickPlayerNotify: "kickPlayerNotify",
        playerAccountGet: "playerAccountGet"
    },
    eventListener: null
};

clientEvent.init = function () {
    clientEvent.eventListener = eventListener.create();
};

clientEvent.on = function (eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.on(eventName, handler, target);
};

clientEvent.off = function (eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.off(eventName, handler, target);
};

clientEvent.clear = function (target) {
    clientEvent.eventListener.clear(target);
};

clientEvent.dispatch = function (eventName, data) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.dispatch(eventName, data);
};

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
        //# sourceMappingURL=clientEvent.js.map
        