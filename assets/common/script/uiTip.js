var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad() {
        setTimeout(function() {
            if (this && this.node) {
                uiFunc.closeUI(this.node.name);
                this.node.destroy();
            }
        }.bind(this), 2000);
    }
});
