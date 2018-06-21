var mvs = require("Matchvs");
var GLB = require("Glb");

cc.Class({
    extends: cc.Component,
    onLoad() {
        Game.GameManager = this;
        cc.game.addPersistRootNode(this.node);
        cc.director.getCollisionManager().enabled = true;
        clientEvent.init();
        dataFunc.loadConfigs();
        cc.view.enableAutoFullScreen(false);
        clientEvent.on(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.on(clientEvent.eventType.leaveRoomNotify, this.leaveRoom, this);
        this.network = kf.require("basic.network");
        this.network.chooseNetworkMode();
        this.getRankDataListener();
        this.findPlayerByAccountListener();
        wx.login({
            success: function() {
                wx.getUserInfo({
                    fail: function(res) {
                        // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                        if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                            // 处理用户拒绝授权的情况
                        }
                    },
                    success: function(res) {
                        Game.GameManager.nickName = res.userInfo.nickName;
                        Game.GameManager.avatarUrl = res.userInfo.avatarUrl;
                        console.log('success', Game.GameManager.nickName);
                    }
                });
            }
        })
    },

    leaveRoom: function(data) {
        // 离开房间--
        clientEvent.dispatch(clientEvent.eventType.leaveRoomNotifyMed, data);
        if (this.gameState === GameState.Play) {
            if (data.leaveRoomInfo.owner === GLB.userInfo.id) {
                GLB.isRoomOwner = true;
            }
            var friends = this.friendIds.filter(function(x) {
                return x === data.leaveRoomInfo.userId;
            });

            if (friends.length > 0) {
                this.friendCnt--;
                if (this.friendCnt === 0) {
                    clientEvent.dispatch(clientEvent.eventType.gameOver, {loseCamp: Camp.Friend});
                    setTimeout(function() {
                        uiFunc.openUI("uiVsResultVer", function(obj) {
                            var uiVsResult = obj.getComponent("uiVsResult");
                            data = {
                                friendIds: this.friendIds,
                                enemyIds: this.enemyIds,
                                selfScore: 3 - this.enemyHearts,
                                rivalScore: 3 - this.friendHearts
                            }
                            uiVsResult.setData(data);
                        }.bind(this))
                    }.bind(this), 1500);
                }
            } else {
                this.enemyCnt--;
                if (this.enemyCnt === 0) {
                    clientEvent.dispatch(clientEvent.eventType.gameOver, {loseCamp: Camp.Enemy});
                    setTimeout(function() {
                        uiFunc.openUI("uiVsResultVer", function(obj) {
                            var uiVsResult = obj.getComponent("uiVsResult");
                            data = {
                                friendIds: this.friendIds,
                                enemyIds: this.enemyIds,
                                selfScore: 3 - this.enemyHearts,
                                rivalScore: 3 - this.friendHearts
                            }
                            uiVsResult.setData(data);
                        }.bind(this))
                    }.bind(this), 1500);
                }
            }
        }
    },

    roundOver: function(data) {
        this.curRound++;
        switch (data.loseCamp) {
            case Camp.Friend:
                this.friendHearts -= 1;
                break;
            case Camp.Enemy:
                this.enemyHearts -= 1;
                break;
            case Camp.None:
                this.enemyHearts -= 1;
                this.friendHearts -= 1;
                break;
        }

        if (this.enemyHearts > 0 && this.friendHearts > 0 && data.loseCamp === Camp.None) {
            clientEvent.dispatch(clientEvent.eventType.timeOver);
        }

        if (this.enemyHearts <= 0 || this.friendHearts <= 0) {
            // 结算界面--
            this.gameState = GameState.Over;
            var loseCamp = Camp.None;
            if (this.enemyHearts <= 0 && this.friendHearts <= 0) {
                loseCamp = Camp.None;
            } else if (this.enemyHearts <= 0) {
                loseCamp = Camp.Enemy;
            } else {
                loseCamp = Camp.Friend;
            }
            clientEvent.dispatch(clientEvent.eventType.gameOver, {loseCamp: loseCamp});
            setTimeout(function() {
                uiFunc.openUI("uiVsResultVer", function(obj) {
                    var uiVsResult = obj.getComponent("uiVsResult");
                    data = {
                        friendIds: this.friendIds,
                        enemyIds: this.enemyIds,
                        selfScore: 3 - this.enemyHearts,
                        rivalScore: 3 - this.friendHearts
                    }
                    uiVsResult.setData(data);
                }.bind(this))
            }.bind(this), 1500);

        } else if (GLB.isRoomOwner) {
            // 下一回合--
            setTimeout(function() {
                this.sendRoundStartMsg();
            }.bind(this), 3000);
        }
    },

    startGame: function() {
        this.friendHearts = 3;
        this.enemyHearts = 3;
        this.curRound = 1;
        this.readyCnt = 0;
        this.friendCnt = this.friendIds.length;
        this.enemyCnt = this.enemyIds.length;

        cc.director.loadScene('game', function() {
            uiFunc.openUI("uiGamePanel", function() {
                this.sendReadyMsg();
            }.bind(this));
        }.bind(this));
    },

    sendRoundOverMsg: function(loseCamp) {
        var msg = {action: GLB.ROUND_OVER, loseCamp: loseCamp};
        this.sendEventEx(msg);
    },

    sendRoundStartMsg: function() {
        var msg = {action: GLB.ROUND_START};
        this.sendEventEx(msg);
    },

    sendReadyMsg: function() {
        var msg = {action: GLB.READY};
        this.sendEventEx(msg);
    },

    matchVsInit: function() {
        mvs.response.initResponse = this.initResponse.bind(this);
        mvs.response.errorResponse = this.errorResponse.bind(this);
        mvs.response.joinRoomResponse = this.joinRoomResponse.bind(this);
        mvs.response.joinRoomNotify = this.joinRoomNotify.bind(this);
        mvs.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
        mvs.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);
        mvs.response.joinOverResponse = this.joinOverResponse.bind(this);
        mvs.response.createRoomResponse = this.createRoomResponse.bind(this);
        mvs.response.getRoomListResponse = this.getRoomListResponse.bind(this);
        mvs.response.getRoomDetailResponse = this.getRoomDetailResponse.bind(this);
        mvs.response.getRoomListExResponse = this.getRoomListExResponse.bind(this);
        mvs.response.kickPlayerResponse = this.kickPlayerResponse.bind(this);
        mvs.response.kickPlayerNotify = this.kickPlayerNotify.bind(this);
        mvs.response.registerUserResponse = this.registerUserResponse.bind(this);
        mvs.response.loginResponse = this.loginResponse.bind(this); // 用户登录之后的回调
        mvs.response.logoutResponse = this.logoutResponse.bind(this); // 用户登录之后的回调
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);

        var result = mvs.engine.init(mvs.response, GLB.channel, GLB.platform, GLB.gameId);
        if (result !== 0) {
            console.log('初始化失败,错误码:' + result);
        }
    },

    kickPlayerNotify: function(kickPlayerNotify) {
        var data = {
            kickPlayerNotify: kickPlayerNotify
        }
        clientEvent.dispatch(clientEvent.eventType.kickPlayerNotify, data);
    },

    kickPlayerResponse: function(kickPlayerRsp) {
        if (kickPlayerRsp.status !== 200) {
            console.log("失败kickPlayerRsp:" + kickPlayerRsp);
            return;
        }
        var data = {
            kickPlayerRsp: kickPlayerRsp
        }
        clientEvent.dispatch(clientEvent.eventType.kickPlayerResponse, data);
    },

    getRoomListExResponse: function(rsp) {
        if (rsp.status !== 200) {
            console.log("失败 rsp:" + rsp);
            return;
        }
        var data = {
            rsp: rsp
        }
        clientEvent.dispatch(clientEvent.eventType.getRoomListExResponse, data);
    },

    getRoomDetailResponse: function(rsp) {
        if (rsp.status !== 200) {
            console.log("失败 rsp:" + rsp);
            return;
        }
        var data = {
            rsp: rsp
        }
        clientEvent.dispatch(clientEvent.eventType.getRoomDetailResponse, data);
    },

    getRoomListResponse: function(status, roomInfos) {
        if (status !== 200) {
            console.log("失败 status:" + status);
            return;
        }
        var data = {
            status: status,
            roomInfos: roomInfos
        }
        clientEvent.dispatch(clientEvent.eventType.getRoomListResponse, data);
    },

    createRoomResponse: function(rsp) {
        if (rsp.status !== 200) {
            console.log("失败 createRoomResponse:" + rsp);
            return;
        }
        var data = {
            rsp: rsp
        }
        clientEvent.dispatch(clientEvent.eventType.createRoomResponse, data);
    },

    joinOverResponse: function(joinOverRsp) {
        if (joinOverRsp.status !== 200) {
            console.log("失败 joinOverRsp:" + joinOverRsp);
            return;
        }
        var data = {
            joinOverRsp: joinOverRsp
        }
        clientEvent.dispatch(clientEvent.eventType.joinOverResponse, data);
    },

    joinRoomResponse: function(status, roomUserInfoList, roomInfo) {
        if (status !== 200) {
            console.log("失败 joinRoomResponse:" + status);
            return;
        }
        var data = {
            status: status,
            roomUserInfoList: roomUserInfoList,
            roomInfo: roomInfo
        }
        clientEvent.dispatch(clientEvent.eventType.joinRoomResponse, data);
    },

    joinRoomNotify: function(roomUserInfo) {
        var data = {
            roomUserInfo: roomUserInfo
        }
        clientEvent.dispatch(clientEvent.eventType.joinRoomNotify, data);
    },

    leaveRoomResponse: function(leaveRoomRsp) {
        if (leaveRoomRsp.status !== 200) {
            console.log("失败 leaveRoomRsp:" + leaveRoomRsp);
            return;
        }
        var data = {
            leaveRoomRsp: leaveRoomRsp
        }
        clientEvent.dispatch(clientEvent.eventType.leaveRoomResponse, data);
    },

    leaveRoomNotify: function(leaveRoomInfo) {
        var data = {
            leaveRoomInfo: leaveRoomInfo
        }
        clientEvent.dispatch(clientEvent.eventType.leaveRoomNotify, data);
    },

    logoutResponse: function(status) {
        cc.game.removePersistRootNode(this.node);
        cc.director.loadScene('lobby');
    },

    errorResponse: function(error, msg) {
        if (error === 1001) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    uiTip.setData("网络断开连接");
                }
            });
            setTimeout(function() {
                mvs.engine.logout("");
                cc.game.removePersistRootNode(this.node);
                cc.director.loadScene('lobby');
            }.bind(this), 2500);
        }
        console.log("错误信息：" + error);
        console.log("错误信息：" + msg);
    },

    initResponse: function() {
        console.log('初始化成功，开始注册用户');
        var result = mvs.engine.registerUser();
        if (result !== 0) {
            console.log('注册用户失败，错误码:' + result);
        } else {
            console.log('注册用户成功');
        }
    },

    registerUserResponse: function(userInfo) {
        var deviceId = 'abcdef';
        var gatewayId = 0;
        GLB.userInfo = userInfo;

        console.log('开始登录,用户Id:' + userInfo.id)

        var result = mvs.engine.login(
            userInfo.id, userInfo.token,
            GLB.gameId, GLB.gameVersion,
            GLB.appKey, GLB.secret,
            deviceId, gatewayId
        );
        if (result !== 0) {
            console.log('登录失败,错误码:' + result);
        }
    },

    loginResponse: function(info) {
        if (info.status !== 200) {
            console.log('登录失败,异步回调错误码:' + info.status);
        } else {
            console.log('登录成功');
            this.lobbyShow();
        }
    },

    lobbyShow: function() {
        this.gameState = GameState.None;
        if (cc.Canvas.instance.designResolution.height > cc.Canvas.instance.designResolution.width) {
            uiFunc.openUI("uiLobbyPanelVer");
        } else {
            uiFunc.openUI("uiLobbyPanel");
        }
    },

    // 玩家行为通知--
    sendEventNotify: function(info) {
        var cpProto = JSON.parse(info.cpProto);

        if (info.cpProto.indexOf(GLB.GAME_START_EVENT) >= 0) {
            GLB.playerUserIds = [GLB.userInfo.id]
            var remoteUserIds = JSON.parse(info.cpProto).userIds;
            // 分队--
            if (remoteUserIds.length % 2 !== 0) {
                return console.log("人数不为偶数, 无法开战！");
            }
            var selfCamp = 0;
            var index;
            for (index = 0; index < remoteUserIds.length; index++) {
                if (GLB.userInfo.id === remoteUserIds[index]) {
                    if (index < remoteUserIds.length / 2) {
                        selfCamp = 0;
                    } else {
                        selfCamp = 1;
                    }
                    break;
                }
            }
            this.enemyIds = [];
            this.friendIds = [GLB.userInfo.id];
            for (index = 0; index < remoteUserIds.length; index++) {
                var camp = 0;
                if (index < remoteUserIds.length / 2) {
                    camp = 0;
                } else {
                    camp = 1;
                }
                if (camp === selfCamp) {
                    if (remoteUserIds[index] !== GLB.userInfo.id) {
                        this.friendIds.push(remoteUserIds[index]);
                    }
                } else {
                    this.enemyIds.push(remoteUserIds[index]);
                }
            }
            GLB.playerUserIds = this.friendIds.concat(this.enemyIds);
            console.log("remoteUserIds:" + remoteUserIds);
            console.log("GLB.playerUserIds:" + GLB.playerUserIds);

            this.startGame();
        }

        var player = null;
        if (info.cpProto.indexOf(GLB.PLAYER_FLY_EVENT) >= 0) {
            player = Game.PlayerManager.getPlayerByUserId(info.srcUserId);
            if (player) {
                player.flyNotify();
            }
        }

        if (info.cpProto.indexOf(GLB.PLAYER_FIRE_EVENT) >= 0) {
            for (var i = 0; i < GLB.playerUserIds.length; i++) {
                player = Game.PlayerManager.getPlayerByUserId(GLB.playerUserIds[i]);
                if (player) {
                    for (var j = 0; j < cpProto.data.length; j++) {
                        if (cpProto.data[j].playerId === player.userId) {
                            player.fireNotify(cpProto.data[j].bulletPointY);
                        }
                    }
                }
            }
        }

        if (info.cpProto.indexOf(GLB.NEW_ITEM_EVENT) >= 0) {
            Game.ItemManager.spawnItemNotify(cpProto);
        }

        if (info.cpProto.indexOf(GLB.PLAYER_GET_ITEM_EVENT) >= 0) {
            player = Game.PlayerManager.getPlayerByUserId(cpProto.playerId);
            if (player) {
                player.getItemNotify(cpProto);
            }
        }

        if (info.cpProto.indexOf(GLB.PLAYER_REMOVE_ITEM_EVENT) >= 0) {
            player = Game.PlayerManager.getPlayerByUserId(info.srcUserId);
            if (player) {
                player.removeItemNotify(cpProto);
            }
        }

        if (info.cpProto.indexOf(GLB.PLAYER_HURT_EVENT) >= 0) {
            if (Game.GameManager.gameState !== GameState.Over) {
                player = Game.PlayerManager.getPlayerByUserId(cpProto.playerId);
                if (player) {
                    player.hurtNotify(cpProto.murderId);
                }
                // 检查回合结束--
                var loseCamp = Game.PlayerManager.getLoseCamp();
                if (loseCamp != null) {
                    Game.GameManager.gameState = GameState.Over
                    if (GLB.isRoomOwner) {
                        this.sendRoundOverMsg(loseCamp);
                    }
                }
            }
        }

        if (info.cpProto.indexOf(GLB.ROUND_OVER) >= 0) {
            Game.GameManager.gameState = GameState.Over;
            // 如果发送方为敌方--
            var loseCamp1 = cpProto.loseCamp;
            if (this.friendIds.indexOf(info.srcUserId) < 0) {
                if (loseCamp1 === Camp.Friend) {
                    loseCamp1 = Camp.Enemy;
                } else if (loseCamp1 === Camp.Enemy) {
                    loseCamp1 = Camp.Friend;
                }
            }
            clientEvent.dispatch(clientEvent.eventType.roundOver, {loseCamp: loseCamp1});
        }

        if (info.cpProto.indexOf(GLB.ROUND_START) >= 0) {
            Game.GameManager.gameState = GameState.Play;
            clientEvent.dispatch(clientEvent.eventType.roundStart);
        }

        if (info.cpProto.indexOf(GLB.READY) >= 0) {
            this.readyCnt++;
            if (GLB.isRoomOwner && this.readyCnt >= GLB.playerUserIds.length) {
                this.sendRoundStartMsg();
            }
        }

        if (info.cpProto.indexOf(GLB.TIME_OVER) >= 0) {
            Game.GameManager.gameState = GameState.Over;
            for (var m = 0; m < GLB.playerUserIds.length; m++) {
                player = Game.PlayerManager.getPlayerByUserId(GLB.playerUserIds[m]);
                if (player) {
                    player.dead();
                }
            }
            clientEvent.dispatch(clientEvent.eventType.roundOver, {loseCamp: Camp.None});
        }
    },

    sendEventEx: function(msg) {
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log(msg.action, result.result);
        }
    },

    getRankDataListener: function() {
        this.network.on("connector.rankHandler.getRankData", function(recvMsg) {
            uiFunc.openUI("uiRankPanelVer", function(obj) {
                var uiRankPanel = obj.getComponent("uiRankPanel");
                uiRankPanel.setData(recvMsg.rankArray);
            });
        }.bind(this));
    },

    findPlayerByAccountListener: function() {
        this.network.on("connector.entryHandler.findPlayerByAccount", function(recvMsg) {
            clientEvent.dispatch(clientEvent.eventType.playerAccountGet, recvMsg);
        });
    },

    loginServer: function() {
        if (!this.network.isConnected()) {
            this.network.connect(GLB.IP, GLB.PORT, function() {
                    this.network.send("connector.entryHandler.login", {
                        "account": GLB.userInfo.id + "",
                        "channel": "0",
                        "userName": Game.GameManager.nickName ? Game.GameManager.nickName : GLB.userInfo.id + "",
                        "headIcon": Game.GameManager.avatarUrl ? Game.GameManager.avatarUrl : "-"
                    });
                    setTimeout(function() {
                        this.network.send("connector.rankHandler.updateScore", {
                            "account": GLB.userInfo.id + "",
                            "game": "game0"
                        });
                    }.bind(this), 500);

                }.bind(this)
            );
        } else {
            this.network.send("connector.rankHandler.updateScore", {
                "account": GLB.userInfo.id + "",
                "game": "game0"
            });
        }
    },

    userInfoReq: function(userId) {
        if (!Game.GameManager.network.isConnected()) {
            Game.GameManager.network.connect(GLB.IP, GLB.PORT, function() {
                    Game.GameManager.network.send("connector.entryHandler.login", {
                        "account": GLB.userInfo.id + "",
                        "channel": "0",
                        "userName": Game.GameManager.nickName ? Game.GameManager.nickName : GLB.userInfo.id + "",
                        "headIcon": Game.GameManager.avatarUrl ? Game.GameManager.avatarUrl : "-"
                    });
                    setTimeout(function() {
                        Game.GameManager.network.send("connector.entryHandler.findPlayerByAccount", {
                            "account": userId + "",
                        });
                    }, 200);
                }
            );
        } else {
            Game.GameManager.network.send("connector.entryHandler.findPlayerByAccount", {
                "account": userId + "",
            });
        }
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundOver, this.roundOver, this);
    }
});
