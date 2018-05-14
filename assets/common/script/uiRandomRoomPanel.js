var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad() {
        this._super();
        this.playerIcons = [];
        this.playerModel = this.nodeDict["playerIcon"];
        this.playerModel.active = false;
        for (var i = 0; i < GLB.MAX_PLAYER_COUNT; i++) {
            var playerTemp = cc.instantiate(this.playerModel);
            playerTemp.active = true;
            this.nodeDict["playerLayout"].addChild(playerTemp);
            this.playerIcons.push(playerTemp);
        }
        this.nodeDict["quit"].on("click", this.leaveRoom, this);

        mvs.response.joinRoomResponse = this.joinRoomResponse.bind(this);
        mvs.response.joinRoomNotify = this.joinRoomNotify.bind(this);
        mvs.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
        mvs.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);
    },

    joinRandomRoom: function() {
        var result = null;
        if (GLB.matchType === GLB.RANDOM_MATCH) {
            result = mvs.engine.joinRandomRoom(GLB.MAX_PLAYER_COUNT, '');
            if (result !== 0) {
                console.log('进入房间失败,错误码:' + result);
            }
        } else if (GLB.matchType === GLB.PROPERTY_MATCH) {
            var matchinfo = new mvs.MatchInfo();
            matchinfo.maxPlayer = GLB.MAX_PLAYER_COUNT;
            matchinfo.mode = 0;
            matchinfo.canWatch = 0;
            matchinfo.tags = GLB.tagsInfo;
            result = mvs.engine.joinRoomWithProperties(matchinfo, "joinRoomWithProperties");
            if (result !== 0) {
                console.log('进入房间失败,错误码:' + result);
            }
        }
    },

    joinRoomResponse: function(status, userInfoList, roomInfo) {
        if (status !== 200) {
            console.log('进入房间失败,异步回调错误码: ' + status);
        } else {
            console.log('进入房间成功');
            console.log('房间号: ' + roomInfo.roomID);
            this.nodeDict['title'].getComponent(cc.Label).string = '房间号: ' + roomInfo.roomID;
        }
        GLB.roomId = roomInfo.roomID;
        var userIds = [GLB.userInfo.id];
        var playerIcon = null;
        for (var j = 0; j < userInfoList.length; j++) {
            playerIcon = this.playerIcons[j].getComponent('playerIcon');
            if (playerIcon && !playerIcon.userInfo) {
                playerIcon.setData(userInfoList[j]);
                if (GLB.userInfo.id !== userInfoList[j].userId) {
                    userIds.push(userInfoList[j].userId);
                }
            }
        }

        for (var i = 0; i < this.playerIcons.length; i++) {
            playerIcon = this.playerIcons[i].getComponent('playerIcon');
            if (playerIcon && !playerIcon.userInfo) {
                playerIcon.setData(GLB.userInfo);
                break;
            }
        }

        GLB.playerUserIds = userIds;


        if (userIds.length >= GLB.MAX_PLAYER_COUNT) {
            mvs.response.joinOverResponse = this.joinOverResponse.bind(this); // 关闭房间之后的回调
            var result = mvs.engine.joinOver("");
            console.log("发出关闭房间的通知");
            if (result !== 0) {
                console.log("关闭房间失败，错误码：", result);
            }
            console.log('房间用户: ' + userIds);
            GLB.playerUserIds = userIds;
        }
    },

    joinRoomNotify: function(roomUserInfo) {
        console.log("joinRoomNotify, roomUserInfo:" + JSON.stringify(roomUserInfo));
        var playerIcon = null;
        for (var j = 0; j < this.playerIcons.length; j++) {
            playerIcon = this.playerIcons[j].getComponent('playerIcon');
            if (playerIcon && !playerIcon.userInfo) {
                playerIcon.setData(roomUserInfo);
                break;
            }
        }
        if (GLB.playerUserIds.length === GLB.MAX_PLAYER_COUNT - 1) {
        }
    },

    leaveRoom: function() {
        mvs.engine.leaveRoom();
    },

    leaveRoomNotify: function(leaveRoomInfo) {
        if (GLB.roomId === leaveRoomInfo.roomID) {
            for (var i = 0; i < this.playerIcons.length; i++) {
                var playerIcon = this.playerIcons[i].getComponent('playerIcon');
                if (playerIcon && playerIcon.userInfo && playerIcon.playerId === leaveRoomInfo.userId) {
                    playerIcon.init();
                    break;
                }
            }
        }
    },

    leaveRoomResponse: function(leaveRoomRsp) {
        if (leaveRoomRsp.status === 200) {
            console.log("离开房间成功");
            uiFunc.closeUI("uiRandomRoomPanel");
            for (var i = 0; i < this.playerIcons.length; i++) {
                var playerIcon = this.playerIcons[i].getComponent('playerIcon');
                if (playerIcon) {
                    playerIcon.init();
                }
            }
        } else {
            console.log("离开房间失败");
        }
    },


    joinOverResponse: function(joinOverRsp) {
        if (joinOverRsp.status === 200) {
            console.log("关闭房间成功");
            this.notifyGameStart();
        } else {
            console.log("关闭房间失败，回调通知错误码：", joinOverRsp.status);
        }
    },

    notifyGameStart: function() {
        GLB.isRoomOwner = true;
        var msg = {
            action: GLB.GAME_START_EVENT,
            userIds: GLB.playerUserIds
        };
        Game.GameManager.sendEventEx(msg);
    },
});
