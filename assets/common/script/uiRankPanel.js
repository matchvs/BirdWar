var uiPanel = require("uiPanel");

cc.Class({

    extends: uiPanel,
    properties: {
        ranksView: {
            default: null,
            type: cc.ScrollView
        },
    },

    onLoad: function() {
        this._super();
    },

    setData: function() {
        console.log("setData");
        clientEvent.on(clientEvent.eventType.gameStart, this.eventFunc, this);
        clientEvent.dispatch(clientEvent.eventType.gameStart, { info: "chenhao" });
    },

    eventFunc: function(data) {
        this.nodeDict["rankTitle"].getComponent(cc.Label).string = data.info;
    },

    onDestroy: function() {
        clientEvent.off(clientEvent.eventType.gameStart, this.eventFunc, this);
    }
});
