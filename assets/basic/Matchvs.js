var engine;
var response = {};
var MatchInfo;
var CreateRoomInfo;
var RoomFilter;
try {
    engine = Matchvs.MatchvsEngine.getInstance();
    MatchInfo = Matchvs.MatchInfo;
    CreateRoomInfo = Matchvs.CreateRoomInfo;
    RoomFilter = Matchvs.RoomFilter;
} catch (e) {
    try {
        var jsMatchvs = require("matchvs.all");
        engine = new jsMatchvs.MatchvsEngine();
        response = new jsMatchvs.MatchvsResponse();
        MatchInfo = jsMatchvs.MatchInfo;
        CreateRoomInfo = jsMatchvs.CreateRoomInfo;
        RoomFilter = jsMatchvs.RoomFilter;
    } catch (e) {
        var MatchVSEngine = require('MatchvsEngine');
        engine = new MatchVSEngine();
    }
}
module.exports = {
    engine: engine,
    response: response,
    MatchInfo: MatchInfo,
    CreateRoomInfo: CreateRoomInfo,
    RoomFilter: RoomFilter
};