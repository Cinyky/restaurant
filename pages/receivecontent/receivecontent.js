var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {ispage: !1, CenterCoupon: [], Coupons: [], flag: !0, Id: 0, Code: "", index: 0},
  onLoad: function (e) {
    this.setMenu(this);
    app.globalData.getTop();
    this.setData({tempE:e})
  }, onShow(){
    var t = this,e=t.data.tempE;
    $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(function () {
      t.getCouponlist();
    }, e.uid) : t.getCouponlist();
  },receivenow: function (e) {
    if (e.currentTarget.dataset.isreceive == -1) return;
    this.setData({Id: e.currentTarget.dataset.id}), this.getUserReceiveCoupon();
    // var t = e.currentTarget.dataset.id;
    // wx.redirectTo({ url:"/pages/search_product_coupon/search_product_coupon?id=" + t });
  }, outertouch: function () {
    this.setData({flag: !0});
  }, innertouch: function () {
    this.setData({flag: !1});
  }, getCouponlist: function () {
    var e = {openId: app.globalData.UserInfo.WeiXinOpenId}, t = this;
    $.xsr($.makeUrl(userapi.GetVendorCoupons, e), function (e) {
      console.log("优惠券列表：", e, app), e.dataList != null && e.errcode != 1 ? t.setData({
        CenterCoupon: e.dataList,
        ispage: !0
      }) : t.setData({ispage: !0});
    });
  }, getUserReceiveCoupon: function () {
    var e = {openId: app.globalData.UserInfo.WeiXinOpenId, CouponIds: this.data.Id, Code: this.data.Code, IsNewUser: 0},
      t = this;
    $.xsr($.makeUrl(userapi.UserReceiveCoupon, e), function (e) {
      console.log(e.dataList);
      !$.isNull(e.dataList) && e.errcode == 0 ? (t.setData({
        flag: !1,
        Coupons: e.dataList
      }), t.getCouponlist()) : $.alert(e.errmsg);
    });
  }, onShareAppMessage: function () {
    return {
      title: app.globalData.VendorInfo.ShopName,
      desc: app.globalData.VendorInfo.VendorInfo,
      path: "/pages/receivecontent/receivecontent?uid=" + app.globalData.UserInfo.Id
    };
  }
  
}));