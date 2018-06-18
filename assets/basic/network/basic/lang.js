/**
 * Created by leo on 16/3/1.
 */

kf.addModule("basic.lang", function() {
    var languageData = require("LanguageData");

    languageData.get = function(/* arugments */) {
        return languageData.t.apply(this, arguments);
    };

    return languageData;
});
