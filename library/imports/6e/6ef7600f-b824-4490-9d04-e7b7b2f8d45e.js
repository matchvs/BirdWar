"use strict";
cc._RF.push(module, '6ef76APuCREkJ0E57ey+NRe', 'Globals');
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