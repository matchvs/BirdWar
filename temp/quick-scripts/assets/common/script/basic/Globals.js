(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/basic/Globals.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6ef76APuCREkJ0E57ey+NRe', 'Globals', __filename);
// common/script/basic/Globals.js

"use strict";

window.Game = {
    GameManager: null,
    BulletManager: null,
    ItemManager: null,
    PlayerManager: null,

    fireInterval: 1500,
    itemInterval: 8000,
    roundSeconds: 30
};

window.Camp = cc.Enum({
    None: 0,
    Friend: -1,
    Enemy: -1
});

window.ItemType = cc.Enum({
    None: 0,
    Shield: 1,
    Track: 2
});

window.GameState = cc.Enum({
    None: 0,
    Pause: 1,
    Play: 2,
    Over: 3,
    End: 4
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
        //# sourceMappingURL=Globals.js.map
        