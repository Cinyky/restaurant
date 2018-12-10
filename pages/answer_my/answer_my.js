let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let answer_common = require('../../utils/answer_common');
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    let aid = wx.getStorageSync('answer_id');
    t.setData({
      aid: aid,
      head_img_url: app.globalData.UserInfo.photo,
      nickname: app.globalData.UserInfo.NickName,
    });
    t.getAnswer(t.data.aid, false, function (item) {
    });
  },
  onShow() {
    let t = this;
  },
  // 返回首页按钮
  returnHome() {
    wx.navigateBack();
  },
  // 分享
  onShareAppMessage() {
    let t = this;
    let path=`/pages/answer_index/answer_index?aid=${t.data.aid}&openid=${app.globalData.UserInfo.WeiXinOpenId}`;
    console.log(path);
    return {
      title: '微dati',
      path: path,
      success() {
        console.log('转发成功');
      }
    };
  },
  gotoPh(){
    wx.navigateTo({
      url:`/pages/answer_ph/answer_ph`
    });
  }
}, templateMethods, answer_common));