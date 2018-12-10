var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {
    UserInfo: {},
    isShowBtn: !1,
    ProductInfo: null,
    isShowMag: !1,
    Level1Discount: 0,
    Level2Discount: 0,
    imgUrl: "",
    ProductUrl: "",
    ShopName: "",
    buyname: ""
  }, onLoad(e){
    this.setData({tempE:e})
  },onShow: function () {
    var t = this;
    let e=this.data.tempE;
    this.setMenu(this);
    app.globalData.getTop();
    console.log(e);
    $.getCache("isShowMag", function (e) {
    }, function () {
      $.setCache("isShowMag", "true", function () {
        t.setData({isShowMag: !0});
      });
    });
    var t = this;
    $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(function () {
      t.setData({isShowBtn: $.isNull(e.uid) ? !1 : !0}), t.getPageInfo($.isNull(e.uid) ? app.globalData.UserInfo.Id : e.uid);
    }, e.uid) : (this.setData({isShowBtn: $.isNull(e.uid) ? !1 : !0}), this.getPageInfo($.isNull(e.uid) ? app.globalData.UserInfo.Id : e.uid)), $.isNull(e.pid) ? wx.setNavigationBarTitle({title: "我要代言"}) : (wx.setNavigationBarTitle({title: "我要推广"}), this.setData({ProductInfo: e}));
  }, onShareAppMessage: function () {
    this.setData({isShowMag: !1});
    var e, t, n;
    return $.isNull(this.data.ProductInfo) ? (e = "/pages/endorsement/endorsement?uid=" + this.data.UserInfo.Id, t = this.data.UserInfo.NickName + "偷偷的告诉你，粉丝也能赚钱哦~") : (e = "/pages/endorsement/endorsement?pid=" + this.data.ProductInfo.pid + "&pname=" + this.data.ProductInfo.pname + "&pprice=" + this.data.ProductInfo.pprice + "&ppic=" + this.data.ProductInfo.ppic + "&uid=" + this.data.UserInfo.Id + "&type=" + this.data.ProductInfo.type, t = "我发现这个商品很好，非常适合你哦！"), {
      title: t,
      desc: t,
      path: e
    };
  }, share: function () {
    this.getPageInfo(app.globalData.UserInfo.Id), this.setData({isShowBtn: !1});
  }, getPageInfo: function (e) {
    var t = this, n = {UserId: e, path: "pages/index/index?uid=" + e, width: 430};
    t.setData({
      Level1Discount: app.globalData.VendorInfo.Level1Discount,
      Level2Discount: app.globalData.VendorInfo.Level2Discount
    }), $.xsr($.makeUrl(userapi.GetPageQRCode, n), function (e) {
      t.setData({UserInfo: app.globalData.UserInfo, User: e.dataList, ShopName: app.globalData.VendorInfo.ShopName});
    });
  }, closeMsk: function () {
    this.setData({isShowMag: !1});
  }
}));