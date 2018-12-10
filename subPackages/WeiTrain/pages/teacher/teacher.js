let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let weitrain_common = require('../../scripts/weitrain_common');
let apiList=require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    //加载老师信息
    t.getTeacherInfo();
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.refresh();
  },
  //加载数据
  loadData: function () {
  
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
  //跳转至老师具体页面
  bindToTeacherDetail:function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url:"/subPackages/WeiTrain/pages/teacher_detail/teacher_detail?id="+id
    })
  },
  // //打电话
  // startPhone: function (e) {
  //   const phone = e.currentTarget.dataset.phone;
  //   wx.makePhoneCall({
  //     phoneNumber: phone
  //   });
  // },
}, templateMethods, weitrain_common));
