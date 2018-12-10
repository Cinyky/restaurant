let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let weitrain_common = require('../../scripts/weitrain_common');
let apiList=require('../../scripts/apiList');
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
    //获取店铺配置
    t.getSetting();
    //获取课程信息
    t.getLesson();
    //获取视频实录列表
    t.getVideoList();
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.refresh();
  },
  //加载数据
  loadData: function () {
  },
  //调起地图
  getMap:function () {
    if(this.data.flag){
      this.setData({flag:0})
    }else{
      this.setData({
        flag:1,
        lat:this.data.setting.lat,
        lng:this.data.setting.lng,
        markers: [{
          id: 1,
          latitude: this.data.setting.lat,
          longitude: this.data.setting.lng,
          name: this.data.setting.train_name
        }],
      });
      console.log(this.data.lat);
      console.log(this.data.lng);
      this.mapCtx = wx.createMapContext('myMap')
    }
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
  //跳转至老师页面
  bindTeacher: function () {
    wx.navigateTo({
      url:"/subPackages/WeiTrain/pages/teacher/teacher"
    })
  },
  //跳转至课程页面
  bindToLesson: function () {
    wx.navigateTo({
      url: "/subPackages/WeiTrain/pages/lesson/lesson"
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
  //跳转至video列表
  bindToVideo:function () {
    wx.navigateTo({
      url: "/subPackages/WeiTrain/pages/video/video"
    })
  },
  //跳转至课表页
  bindToKebiao: function () {
    wx.navigateTo({
      url: "/subPackages/WeiTrain/pages/kebiao/kebiao"
    })
  },
  //跳转至个人中心
  // bind_my: function () {
  //   wx.navigateTo({
  //     url: "/subPackages/WeiTrain/pages/admin/admin"
  //   })
  // }
}, templateMethods, weitrain_common));
