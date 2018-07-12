(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/script/basic/Matchvs.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '11173/l/0JMUr5XExiaAUn8', 'Matchvs', __filename);
// common/script/basic/Matchvs.js

"use strict";

var engine;
var response = {};
var MsMatchInfo;
var MsCreateRoomInfo;
try {
    engine = Matchvs.MatchvsEngine.getInstance();
    MsMatchInfo = Matchvs.MsMatchInfo;
    MsCreateRoomInfo = Matchvs.MsCreateRoomInfo;
} catch (e) {
    try {
        var jsMatchvs = require("matchvs.all");
        engine = new jsMatchvs.MatchvsEngine();
        response = new jsMatchvs.MatchvsResponse();
        MsMatchInfo = jsMatchvs.MsMatchInfo;
        MsCreateRoomInfo = jsMatchvs.MsCreateRoomInfo;
    } catch (e) {
        var MatchVSEngine = require('MatchvsEngine');
        engine = new MatchVSEngine();
    }
}
module.exports = {
    engine: engine,
    response: response,
    MatchInfo: MsMatchInfo,
    CreateRoomInfo: MsCreateRoomInfo
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
        //# sourceMappingURL=Matchvs.js.map
        