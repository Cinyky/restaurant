var app = getApp(), $ = require("../../utils/util.js"),
  orderapi = require("../../api/orderAPI.js"),
  sellerApi = require("../../api/sellerAPI.js");
Page({
  data: {OrderInfo: {}, formId: "", isdata: !1},
  onLoad(e){ this.setData({tempE:e})},
  onShow: function () {
    var e=this.data.tempE;
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
    var t = this;
    $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(function () {
      t.InitPage(e);
    }, e.uid) : t.InitPage(e);
  }, InitPage: function (e) {
    var t = {orderid: e.orderid}, n = this;
    let reqObj = sellerApi.getOrderByOrderId;
    reqObj.data = Object.assign({}, reqObj.data, t);
    reqObj.success = function (resp) {
      let e=resp.data;
      if (e.errcode == 0) {
        n.setData({OrderInfo: e.dataList, isdata: !0});
      } else {
        n.setData({isdata: !1});
      }
    };
    wx.request(reqObj);
  }
});