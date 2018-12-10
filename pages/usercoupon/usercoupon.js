var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {
    pageindex: 1,
    tapindex: 0,
    ispage: !0,
    flag: !0,
    UserCoupon: [],
    numNeverUsed: 0,
    numAlreadyused: 0,
    numOutdated: 0
  }, onLoad: function (e) {
    this.setMenu(this);
    app.globalData.getTop();
    this.setData({UserCoupon: []}), this.getCouponlist();
  }, neverused: function () {
    this.setData({tapindex: 0, UserCoupon: [], pageindex: 1}), this.getCouponlist();
  }, alreadyused: function () {
    this.setData({tapindex: 1, UserCoupon: [], pageindex: 1}), this.getCouponlist();
  }, outdated: function () {
    this.setData({tapindex: 2, UserCoupon: [], pageindex: 1}), this.getCouponlist();
  }, usenow: function (e) {
    var t = e.currentTarget.dataset.id, a = e.currentTarget.dataset.all;
    wx.redirectTo({url: a == 1 ? "/pages/search_product/search_product" : "/pages/search_product_coupon/search_product_coupon?id=" + t});
  }, getCouponlist: function () {
    var e = {openId: app.globalData.UserInfo.WeiXinOpenId, PageIndex: this.data.pageindex, Status: this.data.tapindex},
      t = this;
    $.xsr($.makeUrl(userapi.GetUserCouponItem, e), function (e) {
      console.log("优惠券", e), e.dataList != null && e.errcode != 1 && (t.setData({
        numNeverUsed: e.dataList.UnUseTotal,
        numAlreadyused: e.dataList.UsedTotal,
        numOutdated: e.dataList.OutTimeTotal
      }), e.dataList.MyCoupons != null ? e.dataList.MyCoupons.length < 10 ? t.setData({
        UserCoupon: t.data.UserCoupon.concat(e.dataList.MyCoupons),
        flag: !1,
        ispage: !1
      }) : t.setData({
        UserCoupon: t.data.UserCoupon.concat(e.dataList.MyCoupons),
        flag: !0,
        ispage: !0
      }) : t.setData({flag: !1, ispage: !1}));
    });
  }, scrollbottom: function () {
    if (this.data.flag) {
      var e = this;
      clearTimeout(t);
      var t = setTimeout(function () {
        e.setData({pageindex: parseInt(e.data.pageindex) + 1}), e.getCouponlist();
      }, 500);
    }
  }
}));