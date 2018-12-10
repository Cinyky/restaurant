var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {tapindex: 1, pageindex: 1, TimeSpan: 1, ispage: !0, flag: !0, UserFans: []}, onLoad: function (e) {
    this.setMenu(this);
    $.isNull(e.tp) || this.setData({tapindex: 2, pageindex: 1, TimeSpan: 2, ispage: !0, flag: !0});
  }, onShow: function () {
    app.globalData.getTop();
    this.setData({UserFans: []}), this.InitData();
  }, InitData: function () {
    var e = {userId: app.globalData.UserInfo.Id, TimeSpan: this.data.TimeSpan, PageIndex: this.data.pageindex},
      t = this;
    $.xsr($.makeUrl(userapi.GetUserCashBonusesDetail, e), function (e) {
      e.dataList != null && e.errcode != 1 ? e.dataList.length < 10 ? t.setData({
        UserFans: t.data.UserFans.concat(e.dataList),
        flag: !1,
        ispage: !1
      }) : t.setData({UserFans: t.data.UserFans.concat(e.dataList)}) : t.setData({flag: !1, ispage: !1});
    });
  }, scrollbottom: function () {
    if (this.data.flag) {
      var e = this;
      clearTimeout(t);
      var t = setTimeout(function () {
        e.setData({pageindex: parseInt(e.data.pageindex) + 1}), e.InitData();
      }, 500);
    }
  }, earningsToday: function () {
    this.setData({tapindex: 1, pageindex: 1, TimeSpan: 1, ispage: !0, flag: !0, UserFans: []}), this.InitData();
  }, nearlyAMonth: function () {
    this.setData({tapindex: 2, pageindex: 1, TimeSpan: 2, ispage: !0, flag: !0, UserFans: []}), this.InitData();
  }, nearlyThreeMonths: function () {
    this.setData({tapindex: 3, pageindex: 1, TimeSpan: 3, ispage: !0, flag: !0, UserFans: []}), this.InitData();
  }, allDay: function () {
    this.setData({tapindex: 4, pageindex: 1, TimeSpan: 0, ispage: !0, flag: !0, UserFans: []}), this.InitData();
  }
}));