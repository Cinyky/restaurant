let app = getApp();
let WxParse = require('../../../wxParse/wxParse.js');
let templateMethods = require("../../../utils/template_methods.js");
let myTools = require('../../../utils/myTools');
let cp_common = require('../../../utils/cp_common');
let cpAPI = require('../../../api/cpAPI');
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    let id = options.id;
    t.getSetting(0, function (setting) {
      // 解析html
      WxParse.wxParse('article', 'html', setting.about.content, t, 5);
      // 设置标题
      wx.setNavigationBarTitle({
        title: setting.about.title1 || '关于我们',
      });
    });
  },
}, templateMethods, cp_common));