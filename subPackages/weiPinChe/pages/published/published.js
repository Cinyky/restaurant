let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let api = require('../../scripts/apiList');
let wpc_common = require('../../scripts/wpc_common');
let apiList = require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    tabIndex: 0,
    list: [],
    offset: 0,
    hasMore: 1
  },
  // 人找车<>车找人 标签页切换
  toggleTab: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      tabIndex: index
    });
    that.refresh();
  },
  // 刷新
  refresh: function () {
    const that = this;
    that.setData({
      list: [],
      offset: 0,
      hasMore: 1
    });
    that.loadData();
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    console.log('跳转之后的参数', options);
    const that = this;
    let tabIndex = options.tabIndex || 0;
    that.setData({
      tabIndex: tabIndex
    });
    // 发起请求获取数据列表
    that.loadData();
  },
  loadData: function () {
    const that = this;
    let api = apiList.getPublished;
    wx.myRequest({
      url: api.url,
      data: {
        type: that.data.tabIndex
      },
      method: api.method,
      success: function (resp) {
        let list = resp.data.data;
        that.setData({
          list: list,
        });
        wx.stopPullDownRefresh();
      }
    });
  },
  startPhone: function (e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  onReachBottom: function () {
    // const that = this;
    // if (!that.data.hasMore) {
    //   return false;
    // }
    // // 发起请求获取数据列表
    // that.loadData();
  },
  onPullDownRefresh: function () {
    const that = this;
    that.refresh();
  }
}, templateMethods, wpc_common));
