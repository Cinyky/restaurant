let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
// let myTools = require('../../../../utils/myTools');
let personcard_common = require('../../scripts/personcard_common');
let apiList=require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    name:'',
    editopenid:''
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    if(options.id){
      t.getCardInfo(options.id);
      t.setData({
        editopenid:options.id,
        openid:options.id
      })
    }else{
      //获取用户信息
      app.GetUserInfo(function(){
        console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
        //获取用户头像昵称
        t.getUser(app.globalData.UserInfo.WeiXinOpenId);
        t.setData({
          openid:app.globalData.UserInfo.WeiXinOpenId,
        });
      });
    }
  },
  bindName: function (e) {
    console.log(e);
    if(e.detail.value != '') {
      this.setData({
        name: e.detail.value
      });
    }
  },
  bindPhone: function (e) {
    console.log(e);
    this.setData({
      phone: e.detail.value
    });
  },
  bindCname: function (e) {
    console.log(e);
    this.setData({
      cname: e.detail.value
    });
  },
  bindJob: function (e) {
    console.log(e);
    this.setData({
      job: e.detail.value
    });
  },
  bindEmail: function (e) {
    console.log(e);
    this.setData({
      email: e.detail.value
    });
  },
  bindIntro: function (e) {
    console.log(e);
    this.setData({
      intro:e.detail.value
    })
  },
  bindBtn: function () {
    let t = this;
    var fin_name = '';
    if(t.data.name != ''){
      fin_name = t.data.name;
    }else{
      fin_name = t.data.cardInfo.name;
    }
    console.log('名字：',fin_name);
    console.log('手机:',t.data.phone);
    console.log('公司:',t.data.cname);
    console.log('职位:',t.data.job);
    console.log('邮箱:',t.data.email);
    console.log('介绍:',t.data.intro);
    let api = apiList.submitInfo;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid,
        openid: t.data.openid,
        name:fin_name,
        pic:t.data.cardInfo.pic,
        phone:t.data.phone,
        cname:t.data.cname,
        job:t.data.job,
        email:t.data.email,
        intro:t.data.intro,
        editopenid:t.data.editopenid
      },
      success(resp) {
        console.log('返回的状态:', resp);
        if(resp.data.status == 'success'){
          wx.showModal({
            title     : '成功',
            content   : resp.data.msg,
            showCancel: 0,
            success   : function () {
              wx.navigateTo({
                url: "/subPackages/PersonCard/pages/index/index"
              });
            }
          });
        }else if(resp.data.status == 'error'){
          wx.showModal({
            title     : '失败',
            content   : resp.data.msg,
            showCancel: 0
          });
        }
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  }
}, templateMethods, personcard_common));
