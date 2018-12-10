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
    this.setData({tempE:options})
  },
  // 加载数据
  onShow: function () {
    let t = this,options=t.data.tempE;
    app.GetUserInfo(function(){
      console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
      t.setData({
        openid:app.globalData.UserInfo.WeiXinOpenId
      });
    });
    console.log(options);
    //获取具体课程及老师信息
    t.getLessonDetail(options.id);
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
  bindToTeacherDetail:function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url:"/subPackages/WeiTrain/pages/teacher_detail/teacher_detail?id="+id
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
  //转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '转发',
      path: '/subPackages/WeiTrain/pages/lesson_detail/lesson_detail',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //预约
  toBaoming: function() {
    this.setData({
      is_yuyue: 1
    });
  },
  //关闭预约
  closeYuyue: function() {
    this.formReset();
  },
  //提交预约
  formSubmit: function(t) {
    var i = this, n = t.detail.formId, s = t.detail.value;
    console.log('s是：',s);
    let api = apiList.saveYuyue;
    wx.request({
      url:api.url,
      method:api.method,
      data:{
        wid:api.data.wid,
        lessonid:s.lessonid,
        name:s.username,
        phone:s.phone,
        openid:i.data.openid
      },
      success(resp){
        console.log(resp);
        if(resp.data.status == 'success'){
          wx.showModal({
            title:'成功',
            content:'您的信息已经被提交！',
            showCancel:0,
          })
        }else{
          wx.showModal({
            title:'失败',
            content:resp.data.msg,
            showCancel:0,
          })
        }
      }
    })
  },
  formReset: function(t) {
    this.setData({
      phone: "",
      username: "",
      phone_code: "",
      is_yy: 1,
      is_yuyue: 0
    });
  },
  //购买课程
  nav: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:"/subPackages/WeiTrain/pages/pay/pay?id="+id
    })
  },
}, templateMethods, weitrain_common));
