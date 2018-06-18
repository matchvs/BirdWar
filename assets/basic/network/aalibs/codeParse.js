/**
 * Created by leo on 2018/1/14.
 */

kf.addModule("aalibs.codeParse", function() {
    var codeParse = {};

    codeParse.utf8togbk = function(utf8Str) {
        var gbkArr = [];
        for (var i = 0; i < utf8Str.length; i++) {
            var code = utf8Str.charCodeAt(i);
            gbkArr.push("%" + code.toString(16));
        }

        return decodeURI(gbkArr.join(""));
    };

    // arraybuff 2 str
    codeParse.ab2str = function(buf) {
        var bufArr = new Uint8Array(buf);
        var strArr = [];
        for (var i = 0; i < bufArr.length; i++) {
            strArr.push(String.fromCharCode(bufArr[i]));
        }

        return strArr.join("");
    };

    // 字符串转为ArrayBuffer对象，参数为字符串
    codeParse.str2ab = function(str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    };

    codeParse.isBase64 = function(str) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
    };

    return codeParse;
});
