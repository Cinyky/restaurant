let app = getApp();
let WxParse = require('../../../wxParse/wxParse.js');
let templateMethods = require("../../../utils/template_methods.js");
let myTools = require('../../../utils/myTools');
let cp_common = require('../../../utils/cp_common');
let cpAPI = require('../../../api/cpAPI');
Page(Object.assign({}, {
  data: {
    type: 'news',
    content: null,
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    let id = options.id;
    t.getSetting(0, function (setting) {
      t.getContent(t.data.type, id, function (content) {
        WxParse.wxParse('article', 'html', content.content, t, 5);
        wx.setNavigationBarTitle({
          title: content.title || '新闻详情',
        });
      });
    });
  },
}, templateMethods, cp_common));