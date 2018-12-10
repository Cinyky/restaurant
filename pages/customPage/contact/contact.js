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
      // 地图位置标记
      let markers = [
        {
          iconPath: '/assets/customPage/village.png',
          id: 0,
          latitude: setting.contact.lat,
          longitude: setting.contact.lng,
          width: 25,
          height: 25,
        }
      ];
      t.setData({markers: markers});
      // 解析html
      WxParse.wxParse('article', 'html', setting.contact.desc, t, 5);
      // 设置标题
      wx.setNavigationBarTitle({
        title: setting.contact.title1 || '关于我们',
      });
    });
  },
}, templateMethods, cp_common));