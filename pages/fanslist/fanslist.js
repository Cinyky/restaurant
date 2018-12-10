var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {pageindex: 1, tapindex: 1, ispage: !0, flag: !0, UserFans: [], numFan1: 0, numFan2: 0},
  onLoad: function (e) {
    this.setMenu(this);
    app.globalData.getTop();
    this.setData({UserFans: []}), this.getFunlist();
  },
  level1: function () {
    this.setData({tapindex: 1, UserFans: [], pageindex: 1}), this.getFunlist();
  },
  level2: function () {
    this.setData({tapindex: 2, UserFans: [], pageindex: 1}), this.getFunlist();
  },
  getFunlist: function () {
    var e = {
      openId: app.globalData.UserInfo.WeiXinOpenId,
      userId: app.globalData.UserInfo.Id,
      PageIndex: this.data.pageindex,
      Level: this.data.tapindex
    }, t = this;
    $.xsr($.makeUrl(userapi.GetUserFans, e), function (e) {
      console.log("粉丝------：", e.dataList.UserFans.length), e.dataList.UserFans != null && e.errcode != 1 ? (e.dataList.UserFans.length < 10 ? t.setData({
        UserFans: t.data.UserFans.concat(e.dataList.UserFans),
        flag: !1,
        ispage: !1
      }) : t.setData({
        UserFans: t.data.UserFans.concat(e.dataList.UserFans),
        flag: !0,
        ispage: !0
      }), t.setData({numFan1: e.dataList.Total, numFan2: e.dataList.Total2})) : t.setData({flag: !1, ispage: !1});
    });
  },
  scrollbottom: function () {
    if (this.data.flag) {
      var e = this;
      clearTimeout(t);
      var t = setTimeout(function () {
        e.setData({pageindex: parseInt(e.data.pageindex) + 1}), e.getFunlist();
      }, 500);
    }
  }
}));