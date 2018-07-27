require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "https://data.tianziyou.com/matchvsGamesRes/birdwar";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.4627d');
require('main.b658c');