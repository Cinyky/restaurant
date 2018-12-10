let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let weitrain_common = require('../../scripts/weitrain_common');
let apiList=require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    flag:0
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    console.log(options);
    //获取老师信息及课程
    t.getTeacherDetail(options.id);
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
  bindToTeacherDetail:function () {
    wx.navigateTo({
      url:"/subPackages/WeiTrain/pages/teacher_detail/teacher_detail"
    })
  },
  //跳转至课程具体页面
  bindToLessonDetail:function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url:"/subPackages/WeiTrain/pages/lesson_detail/lesson_detail?id="+id
    })
  },
  //选择老师简介
  chooseTeacher: function () {
    this.setData({
      flag:0,
      chooseColor:'#22A582',
    })
  },
  //选择主授课程
  chooseLesson: function () {
    this.setData({
      flag:1
    })
  },
  //打电话
  startPhone: function (e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
}, templateMethods, weitrain_common));
