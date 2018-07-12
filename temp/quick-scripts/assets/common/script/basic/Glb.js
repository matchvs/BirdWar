(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/basic/Glb.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '27c7bfdkgdEMoYQr2pit3ne', 'Glb', __filename);
// common/script/basic/Glb.js

"use strict";

var obj = {
    RANDOM_MATCH: 1, // 随机匹配
    PROPERTY_MATCH: 2, // 属性匹配
    MAX_PLAYER_COUNT: 4,
    PLAYER_COUNTS: [2, 4],
    COOPERATION: 1,
    COMPETITION: 2,
    GAME_START_EVENT: "gameStart",
    NEW_ITEM_EVENT: "newItem",
    PLAYER_FLY_EVENT: "playerFly",
    PLAYER_FIRE_EVENT: "playerFire",
    PLAYER_POSITION_EVENT: "playerPosition",
    PLAYER_GET_ITEM_EVENT: "playerGetItem",
    PLAYER_REMOVE_ITEM_EVENT: "playerRemoveItem",
    PLAYER_HURT_EVENT: "playerHurt",
    READY: "ready",
    ROUND_START: "roundStart",
    ROUND_OVER: "roundOver",
    TIME_OVER: "timeOver",
    IP: "wxrank.matchvs.com",
    PORT: "3010",

    channel: 'MatchVS',
    platform: 'alpha',

    gameId: 201330,
    gameVersion: 1,
    appKey: '7c7b185482d8444bb98bc93c7a65daaa',
    secret: 'f469fb05eee9488bb32adfd85e4ca370',

    gameType: 2,
    matchType: 1,
    tagsInfo: { "title": "A" },
    userInfo: null,
    playerUserIds: [],
    playerSet: new Set(),
    isRoomOwner: false,
    events: {},

    syncFrame: true,
    FRAME_RATE: 5,
    roomId: 0,
    isGameOver: false
};
module.exports = obj;

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
        //# sourceMappingURL=Glb.js.map
        