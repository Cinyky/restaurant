let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let api = require('../../scripts/apiList');
let wpc_common = require('../../scripts/wpc_common');
let apiList=require('../../scripts/apiList')
Page(Object.assign({}, {
  data: {
    tabIndex: 0,
    list: [],
    offset: 0,
    hasMore: 1,
    config:require('../../scripts/config')
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.refresh();
  },
  //加载数据
  loadData: function () {
    const that = this;
    let data = Object.assign({},
      {
        offset: that.data.offset,
        type: that.data.tabIndex
      },
      that.data.queryConditions
    );
    let api=apiList.getList;
    wx.myRequest({
      url: api.url,
      data: data,
      method:api.method,
      success: function (resp) {
        let r = resp.data;
        let list = r.data;
        let newList = that.data.list.concat(list);
        that.setData({
          list: newList,
          offset: that.data.offset + list.length,
          hasMore: list.length >= 10
        });
        wx.stopPullDownRefresh();
      }
    });
  },
  // 人找车<>车找人 标签页切换
  toggleTab: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      tabIndex: index,
      // 切换标签的时候清除查询条件
      queryConditions: {}
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
  //打电话
  startPhone: function (e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  //底部自动加载
  onReachBottom: function () {
    const that = this;
    if (!that.data.hasMore) {
      return false;
    }
    // 发起请求获取数据列表
    that.loadData();
  },
  onPullDownRefresh: function () {
    const that = this;
    that.refresh();
  },
  //清除筛选条件
  selectAll: function () {
    this.setData({
      offset: 0,
      hasMore: 1,
      queryConditions: {}
    });
    this.refresh();
  }
}, templateMethods, wpc_common));
