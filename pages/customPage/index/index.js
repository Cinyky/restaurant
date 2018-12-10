let app = getApp();
let templateMethods = require("../../../utils/template_methods.js");
let myTools = require('../../../utils/myTools');
let cp_common = require('../../../utils/cp_common');
let cpAPI = require('../../../api/cpAPI');
Page(Object.assign({}, {
  data: {},
  onLoad: function () {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    // 获取设置信息
    t.getSetting(1, function (setting) {
      // 地图位置标记
      try{
        let markers = [
          {
            iconPath: '/assets/customPage/village.png',
            id: 0,
            latitude: setting.contact.lat,
            longitude: setting.contact.lng,
            width: 25,
            height: 25,
          }
        ];
        t.setData({markers: markers});
      }catch (e) {
        console.log(e);
      }
      // 获取轮播图列表
      t.getImgList(function (imgList) {
      });
      wx.setNavigationBarTitle({
        title: setting.title
      });
    });
    //发送企业微信提示
    console.log('发送企业微信提示');
    t.sendQiYeMessage();
    t.saveEvent(3);
  },


  //发送企业微信通知
  sendQiYeMessage:function(){
    wx.request({
      url: qiyeapi.sendQiYeMessage.url,
      data: Object.assign({}, {
        userInfo: app.globalData.UserInfo,
        type:'company',
        content:'企业官网',
      }, qiyeapi.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
        } else {
          console.log('日志发送失败!');
        }
      }
    })
  },

  saveEvent:function(eventId){
    wx.request({
      url: qiyeapi.saveCardEvent.url,
      data: Object.assign({}, {
        open_id: app.globalData.UserInfo.WeiXinOpenId,
        event_id: eventId,
      }, qiyeapi.saveCardEvent.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          console.log(res.data.msg);
        } else {
          console.log(res.data.msg);
        }
      }
    })
  },

  // 提交留言
  lySubmit(e) {
    let t = this, vals = e.detail.value;
    console.log(vals);
    let api = cpAPI.submitLy;
    myTools.showLoading();
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        phone: vals.phone,
        email: vals.email,
        content: vals.content,
      },
      success: function (resp) {
        let r = resp.data, rd = r.data;
        wx.showModal({
          title: '提示',
          content: r.msg || '未知错误',
          showCancel: 0
        });
      },
      complete: function () {
        myTools.hideLoading();
      }
    });
  },
    onShareAppMessage(){
      return {
        path:'/pages/index/index?redirect=customPages'
      }
    }
}, templateMethods, cp_common));
