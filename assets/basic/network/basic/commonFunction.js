/**
 * Created by leo on 16/3/25.
 */
kf.addModule("basic.commonFunction", function() {

    var commonFunction = {};

    if (module.exports) commonFunction = module.exports;

    //对象和数组的深拷贝
    commonFunction.clone = function(sObj, deepIndex) {
        if (sObj === null || typeof sObj !== "object") {
            return sObj;
        }

        // 最多拷贝10层
        if (typeof deepIndex === "undefined") {
            deepIndex = 10;
        }

        if (deepIndex <= 0 && sObj instanceof Array) {
            return [];
        } else if (deepIndex <= 0) {
            return {};
        }

        deepIndex--;

        var s = {};
        if (sObj.constructor === Array) {
            s = [];
        }

        for (var i in sObj) {
            if (sObj.hasOwnProperty && sObj.hasOwnProperty(i)) {
                s[i] = commonFunction.clone(sObj[i], deepIndex);
            }
        }

        return s;
    };

    commonFunction.objectToArray = function(srcObj) {

        var resultArr = [];

        // to array
        for (var key in srcObj) {
            if (!srcObj.hasOwnProperty(key)) {
                continue;
            }

            resultArr.push(srcObj[key]);
        }

        return resultArr;
    };

    commonFunction.arrayToObject = function(srcObj, objectKey) {

        var resultObj = {};

        // to object
        for (var key in srcObj) {
            if (!srcObj.hasOwnProperty(key) || !srcObj[key][objectKey]) {
                continue;
            }

            resultObj[srcObj[key][objectKey]] = srcObj[key];
        }

        return resultObj;
    };

    commonFunction.copyProperty = function(oldItem, newItem) {
        // 拷贝属性
        for (var key in oldItem) {
            if (typeof oldItem[key] !== "function") {
                newItem[key] = oldItem[key];
            }
        }
    };

    commonFunction.copyAllToTarget = function(oldItem, newItem) {
        // 拷贝属性
        for (var key in oldItem) {
            newItem[key] = oldItem[key];
        }
    };

    /**
     * 用于检查是否击中概率
     * @param {Number} rate 概率(100%以内的)
     * */
    commonFunction.isHitRate = function(rate) {
        var value = Math.floor(Math.random() * (100));
        return value <= rate;
    };

    commonFunction.prefixInteger = function(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    };

    return commonFunction;
});
