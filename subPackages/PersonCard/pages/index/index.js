let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
// let myTools = require('../../../../utils/myTools');
let personcard_common = require('../../scripts/personcard_common');
let apiList=require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    flag:0,
    is_other:0
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    wx.showLoading({
      title:'请稍等'
    });
    if(options.myopenid){
      t.getCardInfo(options.myopenid);
      t.setData({
        is_other:1
      });
    }else{
      //获取用户信息
      app.GetUserInfo(function(){
        console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
        t.getCardInfo(app.globalData.UserInfo.WeiXinOpenId);
        t.setData({
          openid:app.globalData.UserInfo.WeiXinOpenId,
        });
      });
    }
  },
  //跳转至编辑资料页面
  bindAdd: function () {
    // console.log(this.data.cardInfo.id);return;
    wx.navigateTo({
      url:"/subPackages/PersonCard/pages/add/add"
    })
  },
  //跳转至编辑资料页面
  bindEdit: function () {
    // console.log(this.data.cardInfo.id);return;
    wx.navigateTo({
      url:"/subPackages/PersonCard/pages/add/add?id="+this.data.cardInfo.openid
    })
  },
  //打开分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我的名片',
      path: '/subPackages/PersonCard/pages/index/index?myopenid='+this.data.openid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
}, templateMethods, personcard_common));
