let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let api = require('../../scripts/apiList');
let common = require('../../scripts/common');
let apiList = require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    config: require('../../scripts/config'),
    list: []
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.getSetting(function (setting) {
      let api = apiList.getMyDesign;
      wx.myRequest({
        url: api.url,
        method: api.method,
        data: {},
        success(resp) {
          let r = resp.data, rd = r.data;
          t.setData({list: rd});
        }
      });
    });
  },
  cancelDesign(e) {
    let t = this, ds = e.currentTarget.dataset, id = ds.id;
    console.log('取消', id);
    let api = apiList.cancelDesign;
    wx.myRequest({
      url: api.url,
      method: api.method,
      data: {id: id},
      success(resp) {
        let r = resp.data, rd = r.data;
        wx.showModal({
          title: '提示',
          content: r.msg || '未知错误',
          showCancel: 0,
          success() {
            t.onShow();
          }
        });
      }
    });
  }
}, templateMethods, common));
