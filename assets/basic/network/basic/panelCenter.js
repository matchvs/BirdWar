/**
 * Created by leo on 2017/11/12.
 */

/**
 * Created by leo on 16/2/21.
 */

kf.addModule("basic.panelCenter", function() {
    var clientEvent = kf.require("basic.clientEvent");

    var panelCenter = {};
    var ZORDER = cc.Enum({
        SUB_SCENE_ZORDER: 0,
        BATTLE_ROOM_ZORDER: 3,
        SUB_PANEL_ZORDER: 4,
        COMMON_MASK_ZORDER: 900000,
        WORLD_PANEL_ZORDER: 1000000,
        WORLD_ANIMATION_ZORDER: 1100000,
        MODAL_PANEL_ZORDER: 1200000,
        GLOBAL_FLOATING_PANEL_ZORDER: 1400000,
        LOADING_PANEL_ZORDER: 1500000,
        ALERT_PANEL_ZORDER: 1600000
    });

    panelCenter.init = function() {

    };

    panelCenter.setMaskNodeHide = function() {
        this.maskNode.setBackGroundColorOpacity(0);
    };

    panelCenter.setMaskNodeShow = function() {
        this.maskNode.setBackGroundColorOpacity(150);
    };

    panelCenter.addClickMaskEvent = function(maskNode) {
        maskNode.on('touchstart', function(event) {
            event.stopPropagation();
        });

        maskNode.on('touchend', function(event) {
            event.stopPropagation();
        });

        maskNode.on('touchmove', function(event) {
            event.stopPropagation();
        });

        maskNode.on('touchcancel', function(event) {
            event.stopPropagation();
        });

        maskNode.on('mousedown', function(event) {
            event.stopPropagation();
        });

        maskNode.on('mouseenter', function(event) {
            event.stopPropagation();
        });

        maskNode.on('mousemove', function(event) {
            event.stopPropagation();
        });

        maskNode.on('mouseleave', function(event) {
            event.stopPropagation();
        });

        maskNode.on('touchend', function(event) {
            event.stopPropagation();
        });

        maskNode.on('mousewheel', function(event) {
            event.stopPropagation();
        });
    };

    panelCenter.initGraphic = function(scene, maskNode, uiRoot) {
        this.subScenes = {};
        this.subPanels = {};

        this.newestSubPanelName = "";

        this.runningScene = scene;

        this.initEventDispatcherStack();

        this.curActiveSubScene = uiRoot;
        this.maskNode = maskNode;
        this.maskNode.active = false;
        this.maskNode.width = cc.winSize.width;
        this.maskNode.height = cc.winSize.height;

        this.addClickMaskEvent(this.maskNode);

        this.curCommonSubPanelZorder = ZORDER.WORLD_PANEL_ZORDER;
        this.curModalSubPanelZorder = ZORDER.MODAL_PANEL_ZORDER;

        this.registerEvent();
    };

    panelCenter.getWinSize = function() {
        if (this.curActiveSubScene) {
            return this.curActiveSubScene.getContentSize();
        }

        return this.runningScene.getContentSize();
    };

    panelCenter.initEventDispatcherStack = function() {
        this.subPanelStack = [];

        this.curActiveSubScene = null;
        this.nextSubScene = null;

        this.subPanelStackIndex = -1;

        this.subSceneStack = [];
        this.subSceneStackIndex = 0;

        this.eventDispatcherStack = [];
        this.eventDispatcherStackIndex = 0;
    };

    panelCenter.pushEventDispatcher = function(eventDispatcher) {
        this.eventDispatcherStackIndex = this.eventDispatcherStackIndex + 1;
        this.eventDispatcherStack[this.eventDispatcherStackIndex] = eventDispatcher;

        cc.director.setEventDispatcher(eventDispatcher);
    };

    panelCenter.popEventDispatcher = function() {
        this.eventDispatcherStackIndex = this.eventDispatcherStackIndex - 1;
        var eventDispatcher = this.eventDispatcherStack[this.eventDispatcherStackIndex];

        cc.director.setEventDispatcher(eventDispatcher);
    };

    panelCenter.getSubScene = function(name) {
        var subScene = this.subScenes[name];

        if (!subScene) {
            var director = cc.director;
            var curEventDispatcher = cc.director.getEventDispatcher();

            director.setEventDispatcher(this.originEventDispatcher);

            subScene = subSceneFactory.create(name);

            this.subScenes[name] = subScene;

            this.runningScene.addChild(subScene, ZORDER.SUB_SCENE_ZORDER);
            this.runningScene.sortAllChildren();
            subScene.active = false;

            director.setEventDispatcher(curEventDispatcher);
        }

        return subScene;
    };

    panelCenter.getSubPanel = function(name) {
        return this.subPanels[name];
    };

    // 判断panel是否显示
    panelCenter.getPanelIsVisible = function(name) {
        if (this.getSubPanel(name) && this.getSubPanel(name) && this.getSubPanel(name).active) {
            return true;
        }

        return false;
    };


    panelCenter.getAndCreateSubPanel = function(name, cb) {
        var parent;

        if (!this.curActiveSubScene) {
            parent = this.runningScene;
        } else {
            parent = this.curActiveSubScene;
        }

        var loadOverCallFunc = function(subPanel) {
            if (!subPanel) {
                cc.error("can not find sub panel class ", name);
                return;
            }

            if (!subPanel.getComponent("panel")) {
                cc.error(name, "没有加载panel脚本");
                return;
            }

            var panelComponent = subPanel.getComponent("panel");
            subPanel.setName(name.replace(/\//g, "."));
            this.subPanels[name] = subPanel;

            // if (panelComponent.customOrder) {
            //     parent = this.runningScene;
            // }

            if (subPanel.getParent() !== parent) {
                subPanel.parent = parent;
                if (panelComponent.isModal) {
                    parent.setLocalZOrder(ZORDER.MODAL_PANEL_ZORDER);
                } else if (panelComponent.customOrder) {
                    parent.setLocalZOrder(panelComponent.customOrder);
                } else {
                    parent.setLocalZOrder(ZORDER.WORLD_PANEL_ZORDER);
                }
            }

            subPanel.active = false;

            cb(subPanel);
        }.bind(this);

        var subPanel = this.subPanels[name];
        if (!subPanel) {
            var pathName = name;
            var paths = [];
            if (cc.loader._resources.getAllPaths) {
                // creator 1.6.2的写法
                paths = cc.loader._resources.getAllPaths();
            } else {
                paths = Object.keys(cc.loader._resources._pathToUuid);
            }
            for (var i = 0; i < paths.length; i++) {
                var aliasPath = paths[i];
                var aliasArr = aliasPath.split("/");
                if (aliasArr[aliasArr.length - 1] === name) {
                    pathName = aliasPath;
                    break;
                }
            }
            cc.loader.loadRes(pathName, cc.Prefab, function(err, prefab) {
                subPanel = null;

                if (this.subPanels[name]) {
                    subPanel = this.subPanels[name];
                } else if (!err) {
                    if (cc.supportJit) {
                        cc.supportJit = false;
                        subPanel = cc.instantiate(prefab);
                        cc.supportJit = true;
                    } else {
                        subPanel = cc.instantiate(prefab);
                    }
                }
                loadOverCallFunc(subPanel);
            }.bind(this));
        } else {
            loadOverCallFunc(subPanel);
        }
    };

    panelCenter.finishChangeSubScene = function() {
        if (this.curActiveSubScene) {
            this.curActiveSubScene.hide(this.nextSubScene.getName());
            this.curActiveSubScene.setPosition(0, 0);
        }

        this.curActiveSubScene = this.nextSubScene;
        this.nextSubScene = null;

        this.subPanelStack = [];
        this.subPanelStackIndex = -1;
        cc.eventManager.setEnabled(true);
    };

    panelCenter.registerEvent = function() {
        clientEvent.on("showSubScene", function(subSceneName) {
            this.hideAllSubPanel();
            cc.log("show_world_subScene:" + subSceneName);

            var subScene = this.getSubScene(subSceneName);
            if (subScene.active) {
                return;
            }

            this.nextSubScene = subScene;

            if (this.curActiveSubScene) {
                if (subScene.isRememberFromScene()) {
                    this.pushSubScene(this.curActiveSubScene);
                } else {
                    this.subSceneStackIndex = 0;
                }
            }

            this.finishChangeSubScene();

            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            subScene.show.apply(subScene, args);
        }.bind(this));

        clientEvent.on("showPanel", function(panelName) {
            // pass arguments to panel.show except panelName
            var args = [];
            var i;
            for (i = 1; i < arguments.length; ++i) {
                args[args.length] = arguments[i];
            }

            this.getAndCreateSubPanel(panelName, function(panel) {
                if (!panel) {
                    cc.error("can't find " + panelName);
                    return;
                }

                console.log("showPanel:" + panelName);

                this.newestSubPanelName = panelName;

                if (panel.active) {
                    clientEvent.dispatchEvent("hidePanel", panelName);
                }

                i = 0;
                var subPanel;
                var panelComponent = panel.getComponent("panel");
                if (panelComponent.isModal) {
                    var index = -1;
                    for (i = 0; i <= this.subPanelStackIndex; i++) {
                        subPanel = this.subPanelStack[i];
                        if (subPanel.getName() === panel.getName()) {
                            index = i;
                            break;
                        }
                    }

                    if (index !== -1) {
                        this.subPanelStack.splice(index, 1);
                        this.subPanelStackIndex = this.subPanelStackIndex - 1;
                        // for (i = index; i < this.subPanelStackIndex; i++) {
                        //     subPanel = this.subPanelStack[i];
                        //     subPanel.setLocalZOrder(subPanel.getLocalZOrder());
                        // }
                    }

                    this.curModalSubPanelZorder = this.curModalSubPanelZorder + 1;

                    this.pushSubPanel(panel);
                    panel.setLocalZOrder(this.curModalSubPanelZorder);
                } else if (panelComponent.customOrder) {
                    panel.setLocalZOrder(panelComponent.customOrder);
                } else {
                    this.curCommonSubPanelZorder = this.curCommonSubPanelZorder + 1;
                    panel.setLocalZOrder(this.curCommonSubPanelZorder);
                }

                if (panelComponent.show) {
                    panelComponent.show.apply(panelComponent, args);
                }
            }.bind(this));
        }.bind(this));

        clientEvent.on("hidePanel", function(panelName) {
            this.getAndCreateSubPanel(panelName, function(panel) {
                var panelComponent = panel.getComponent("panel");
                if (!panel || (!panel.active && !panelComponent.isModal)) {
                    return;
                }

                var i;
                // 隐藏遮罩层;
                var subPanel;
                do {
                    if (panelComponent.isModal) {
                        subPanel = this.subPanelStack[this.subPanelStackIndex];
                        if (!subPanel && this.subPanelStack.length > 0) {
                            this.subPanelStackIndex = this.subPanelStack.length - 1;
                            subPanel = this.subPanelStack[this.subPanelStackIndex];
                        }

                        if (!subPanel) {
                            break;
                        }

                        if (subPanel.getName() !== panelName) {
                            var index = -1;
                            for (i = 0; i <= this.subPanelStackIndex; i++) {
                                subPanel = this.subPanelStack[i];
                                if (subPanel.getName() === panel.getName()) {
                                    index = i;
                                    break;
                                }
                            }

                            if (index >= 0) {
                                this.subPanelStack.splice(index, 1);
                                this.subPanelStackIndex = this.subPanelStackIndex - 1;
                                this.curModalSubPanelZorder = this.curModalSubPanelZorder - 1;
                            }

                            break;
                        }

                        this.popSubPanel();
                        subPanel = this.subPanelStack[this.subPanelStackIndex];
                        this.curModalSubPanelZorder = this.curModalSubPanelZorder - 1;

                        if (subPanel) {
                            this.showMaskNode(subPanel);
                        } else {
                            this.maskNode.active = false;
                        }
                    } else {
                        // this.curCommonSubPanelZorder = this.curCommonSubPanelZorder - 1;
                    }
                } while (0);

                // pass all arguments to prompt_panel except panel name
                var args = [];
                for (i = 1; i < arguments.length; ++i) {
                    args[args.length] = arguments[i];
                }

                if (panelComponent.hide) {
                    panelComponent.hide.apply(panelComponent, args);
                }
            }.bind(this));
        }.bind(this));
    };

    panelCenter.pushSubPanel = function(subPanel) {
        this.subPanelStackIndex = this.subPanelStackIndex + 1;
        this.subPanelStack[this.subPanelStackIndex] = subPanel;

        this.showMaskNode(subPanel);
    };

    panelCenter.showMaskNode = function(subPanel) {
        this.maskNode.parent = subPanel.getParent();
        this.maskNode.setLocalZOrder(this.curModalSubPanelZorder - 1);
        this.maskNode.active = true;
    };

    panelCenter.popSubPanel = function() {
        var subPanel = this.subPanelStack.splice(this.subPanelStackIndex, 1)[0];
        this.subPanelStackIndex = this.subPanelStackIndex - 1;

        return subPanel;
    };

    panelCenter.getSubPanelStack = function() {
        return this.subPanelStack;
    };

    panelCenter.hideAllSubPanel = function() {
        var subPanelStack = this.subPanelStack;
        for (var idx = this.subPanelStackIndex; idx >= 0; idx--) {
            clientEvent.dispatchEvent("hidePanel", subPanelStack[idx]["__name"]);
        }

        this.subPanelStackIndex = -1;
    };

    /**
     * 获取最新的subpanel的名称，主要部分界面在初始化的时候需要了解当前最新的subPanel是谁
     * */
    panelCenter.getNewestPanel = function() {
        return this.newestSubPanelName;
    };

    panelCenter.getCurSubScene = function() {
        return this.curActiveSubScene;
    };

    // 晃panel rootNode:panel的rootNode, time:s
    panelCenter.shakePanel = function(rootNode, time) {
        var perTime = time / 4;
        rootNode.runAction(cc.sequence(
            cc.delayTime(0.07),
            cc.scaleTo(perTime, 1.01, 1.01),
            cc.jumpBy(perTime, cc.p(0, 0), 5, 12),
            cc.scaleTo(perTime, 0.99, 0.99),
            cc.scaleTo(perTime, 1, 1)
        ));
    };

    return panelCenter;
});

