/**
 * Created by john on 16/10/7.
 * 适配creator，做了简化
 */

window.kf = window.kf || {};

kf._loadedItem = {};
kf.ignoreInitArr = [];
kf.addIgnoreInitDir = function(dirStr) {
    kf.ignoreInitArr.push(dirStr);
};

kf.addModule = function(requireName, cb) {
    var splitNameSpace = requireName.split(".");
    var item = window;
    var i;
    for (i = 0; i < splitNameSpace.length - 1; i++) {
        if (!item[splitNameSpace[i]]) {
            item[splitNameSpace[i]] = {};
        }

        item = item[splitNameSpace[i]];
    }

    item[splitNameSpace[splitNameSpace.length - 1]] = cb;
};

kf.require = function(requireName, noInit) {
    if (CC_EDITOR && requireName.indexOf("component") === -1) {
        return null;
    }

    var splitNameSpace;
    if (!kf._loadedItem[requireName]) {
        splitNameSpace = requireName.split(".");
        var item = window;
        var i;
        for (i = 0; i < splitNameSpace.length; i++) {
            if (!item) {
                break;
            }
            item = item[splitNameSpace[i]];
        }
        if (item) {
            kf._loadedItem[requireName] = item();
        } else {
            // 如果有\.的化，进行分割，取最后一个
            splitNameSpace = requireName.split(".");
            kf._loadedItem[requireName] = require(splitNameSpace[splitNameSpace.length - 1]);
            if (!kf._loadedItem[requireName] && cc && cc.require && cc.require !== require) {
                kf._loadedItem[requireName] = cc.require(splitNameSpace[splitNameSpace.length - 1]);
            }

            if (kf._loadedItem[requireName]) {
                if (window.cc && !cc.sys.isNative) {
                    console.error("please use kf.require, parentdir.filename!!!");
                }
            }
        }

        if (!noInit && kf._loadedItem[requireName]) {
            for (i = 0; i < kf.ignoreInitArr.length; i++) {
                var key = kf.ignoreInitArr[i];
                if (requireName.indexOf(key) === 0) {
                    break;
                }
            }

            if (i >= kf.ignoreInitArr.length) {
                if (kf._loadedItem[requireName].init) kf._loadedItem[requireName].init();
            }
        }
    }

    return kf._loadedItem[requireName];
};

kf.clone = function(obj) {
    var o;
    if (typeof obj === "object") {
        if (obj === null) {
            o = null;
        } else if (obj instanceof Array) {
            o = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                o.push(this.clone(obj[i]));
            }
        } else {
            o = {};
            for (var j in obj) {
                if (!obj.hasOwnProperty(j)) continue;
                o[j] = this.clone(obj[j]);
            }
        }
    } else {
        o = obj;
    }
    return o;
};

kf.cmp = function(x, y) {
    return JSON.stringify(x) === JSON.stringify(y);
};

/**
 * utf8 byte to unicode string
 * @param utf8Bytes
 * @returns {string}
 */
kf.utf8ByteToUnicodeStr = function(utf8Bytes) {
    var unicodeStr = "";
    for (var pos = 0; pos < utf8Bytes.length;) {
        var flag = utf8Bytes[pos];
        var unicode = 0;
        if ((flag >>> 7) === 0) {
            unicodeStr += String.fromCharCode(utf8Bytes[pos]);
            pos += 1;
        } else if ((flag & 0xFC) === 0xFC) {
            unicode = (utf8Bytes[pos] & 0x3) << 30;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 5] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 6;
        } else if ((flag & 0xF8) === 0xF8) {
            unicode = (utf8Bytes[pos] & 0x7) << 24;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 4] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 5;
        } else if ((flag & 0xF0) === 0xF0) {
            unicode = (utf8Bytes[pos] & 0xF) << 18;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
            unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 3] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 4;
        } else if ((flag & 0xE0) === 0xE0) {
            unicode = (utf8Bytes[pos] & 0x1F) << 12;
            unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 2] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 3;
        } else if ((flag & 0xC0) === 0xC0) { // 110
            unicode = (utf8Bytes[pos] & 0x3F) << 6;
            unicode |= (utf8Bytes[pos + 1] & 0x3F);
            unicodeStr += String.fromCharCode(unicode);
            pos += 2;
        } else {
            unicodeStr += String.fromCharCode(utf8Bytes[pos]);
            pos += 1;
        }
    }
    return unicodeStr;
};


// 将字符串格式化为UTF8编码的字节
kf.writeUTF = function(str, isGetBytes) {
    var back = [];
    var byteSize = 0;
    var i;
    for (i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (code >= 0x00 && code <= 0x7f) {
            byteSize += 1;
            back.push(code);
        } else if (code >= 0x80 && code <= 0x7ff) {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)));
        } else if ((code >= 0x800 && code <= 0xd7ff)
            || (code >= 0xe000 && code <= 0xffff)) {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)));
        }
    }
    for (i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }
    if (isGetBytes) {
        return back;
    }
    if (byteSize <= 0xff) {
        return [0, byteSize].concat(back);
    }

    return [byteSize >> 8, byteSize & 0xff].concat(back);
};

// 读取UTF8编码的字节，并专为Unicode的字符串
kf.readUTF = function(arr) {
    if (typeof arr === 'string') {
        return arr;
    }

    var UTF = '';
    var _arr = arr;

    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2);
        var v = one.match(/^1+?(?=0)/);
        if (v && one.length === 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            UTF += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            UTF += String.fromCharCode(_arr[i]);
        }
    }

    return UTF;
};

// Changes XML to JSON
kf.xmlToJson = function(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                if (attribute.nodeName === "size"
                    || attribute.nodeName === "define"
                    || attribute.nodeName === "mandatory") {
                    continue;
                }

                obj[attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3 && xml.nodeName !== "#text") {
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (nodeName === "#text") continue;

            if (typeof (obj[nodeName]) === "undefined" || nodeName === "#text") {
                obj[nodeName] = this.xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].length) === "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(this.xmlToJson(item));
            }
        }
    }
    return obj;
};

kf.loadXMLStr = function(xmlString) {
    var xmlDoc = null;
    // 判断浏览器的类型//支持IE浏览器
    // DOMParser判断是否是非ie浏览器
    if (!window.DOMParser && window.ActiveXObject) {
        var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
        for (var i = 0; i < xmlDomVersions.length; i++) {
            try {
                xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString); // loadXML方法载入xml字符串
                break;
            } catch (e) {
                console.error(e);
            }
        }
    } else if (window.DOMParser && document.implementation && document.implementation.createDocument) { // 支持Mozilla浏览器
        try {
            /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
             * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
             * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
             * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
             */
            var domParser = new DOMParser();
            xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
        } catch (e) {
            console.error(e);
        }
    } else {
        return null;
    }

    return xmlDoc;
};

kf.touchInNode = function(node, touch) {
    var pos = node.convertTouchToNodeSpace(touch);
    var temp = node.getContentSize();
    var myRect = new cc.Rect(0, 0, temp.width, temp.height);
    return cc.rectContainsPoint(myRect, pos);
};

// 获取节点在根节点局部坐标系的坐标
kf.getLocationInRoot = function(node) {
    var locationX = node.x;
    var locationY = node.y;
    var parent = node.parent;
    while (parent && parent.parent && !(parent.parent instanceof cc.Scene)) {
        locationX += parent.x;
        locationY += parent.y;
        parent = parent.parent;
    }
    return cc.p(locationX, locationY);
};

window.string = {};
string.format = function(str /* arguments */) {
    var args = arguments;
    var argIndex = 1;
    return str.replace(
        /(%[ds])/g,
        function(/* m, i */) {
            return args[argIndex++];
        }
    );
};
