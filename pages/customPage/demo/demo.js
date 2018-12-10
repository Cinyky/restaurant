let app = getApp();
let WxParse = require('../../../wxParse/wxParse.js');
let templateMethods = require("../../../utils/template_methods.js");
let myTools = require('../../../utils/myTools');
let cp_common = require('../../../utils/cp_common');
let cpAPI = require('../../../api/cpAPI');
Page(Object.assign({}, {
  data: {
    type: 'demo',
    mid: 0,  // 菜单id
    page: 0,
    hasMore: true,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    t.getSetting(0, function (setting) {
      // 设置标题
      wx.setNavigationBarTitle({
        title: setting.demo.title1 || '案例展示',
      });
      // 加载菜单
      t.getMenuList(t.data.type, function (menu) {
        // 获取第一页的内容
        t.loadContentList();
      });
    });
  },

  onReachBottom: function () {
    this.loadContentList();
  },
}, templateMethods, cp_common));