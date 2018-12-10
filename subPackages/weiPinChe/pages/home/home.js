let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let api = require('../../scripts/apiList');
let wpc_common = require('../../scripts/wpc_common');
let apiList = require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    userInfo: null,
    groupIsShow: true,
    config: require('../../scripts/config'),
  },
  // 加载
  onLoad: function (options) {
    let that = this;
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    // 加载用户信息
    wx.getUserInfo({
      withCredentials: false,
      lang: 'zh_CN',
      success: function (resp) {
        that.setData({
          userInfo: resp.userInfo
        });
      }
    });
  },
  //折叠起来菜单
  collapseGroup: function () {
    this.setData({
      groupIsShow: !this.data.groupIsShow
    });
  }
}, templateMethods, wpc_common));
