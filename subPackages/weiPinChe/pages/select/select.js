//获取应用实例
let app = getApp();
let currDate = new Date();
let date_s = [currDate.getFullYear(), currDate.getMonth() + 1, currDate.getDate()].join('-');
let time_s = [(currDate.getHours() >= 10 ? '' : '0') + currDate.getHours(), (currDate.getMinutes() >= 10 ? '' : '0') + currDate.getMinutes()].join(':');
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let apiList = require('../../scripts/apiList');
let wpc_common = require('../../scripts/wpc_common');
Page(Object.assign({}, {
  data: {
    // 表单数据容器
    formData: {
      date: date_s,
      time: time_s,
      people_num: 6
    }
  },
  // 加载
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 日期选择
  bindDateChange: function (e) {
    let that = this;
    that.data.formData.date = e.detail.value;
    console.log(e.detail.value);
    that.setData({
      formData: that.data.formData
    });
  },
  // 时间选择
  bindTimeChange: function (e) {
    let that = this;
    that.data.formData.time = e.detail.value;
    console.log(e.detail.value);
    that.setData({
      formData: that.data.formData
    });
  },
  //通用表单输入
  formInput: function (e) {
    const that = this;
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    that.data.formData[key] = value;
    that.setData({
      formData: that.data.formData
    });
  },
  //筛选条件设置完成
  selectOk: function () {
    let that = this;
    let pages = getCurrentPages();
    let prev = pages[pages.length-2];
    prev.setData({
      offset: 0,
      hasMore: 1,
      queryConditions: that.data.formData
    });
    wx.navigateBack();
  },
  //清除条件
  selectAll: function () {
    let that = this;
    let pages = getCurrentPages();
    let prev = pages[pages.length-2];
    prev.setData({
      offset: 0,
      hasMore: 1,
      queryConditions: {}
    });
    wx.navigateBack();
  }
}, templateMethods, wpc_common));
