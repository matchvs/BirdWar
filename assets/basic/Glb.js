var obj = {
    RANDOM_MATCH: 1,  // 随机匹配
    PROPERTY_MATCH: 2,  // 属性匹配
    MAX_PLAYER_COUNT: 4,
    GAME_START_EVENT: "gameStart",
    NEW_ITEM_EVENT: "newItem",
    PLAYER_FLY_EVENT: "playerFly",
    PLAYER_FIRE_EVENT: "playerFire",
    PLAYER_POSITION_EVENT: "playerPosition",
    PLAYER_GET_ITEM_EVENT: "playerGetItem",
    PLAYER_REMOVE_ITEM_EVENT: "playerRemoveItem",
    PLAYER_HURT_EVENT: "playerHurt",
    ROUND_START: "roundStart",
    ROUND_OVER: "roundOver",
    TIME_OVER: "timeOver",

    channel: 'MatchVS',
    platform: 'alpha',
    gameId: 200757,
    gameVersion: 1,
    appKey: '6783e7d174ef41b98a91957c561cf305',
    secret: 'da47754579fa47e4affab5785451622c',

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
    playertime: 180,
    first: null,
    second: null,
    third: null,
    isGameOver: false,

    scoreMap: new Map(),

    number1: "",
    number2: "",
    number3: "",
};
module.exports = obj;