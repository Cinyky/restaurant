var app = getApp(), $ = require("../../utils/util.js"), WxParse = require("../../wxParse/wxParse.js"),
  userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {pageindex: 3, tapindex: 1, ispage: !1, isShowBnt: !1, isShowMsk: !1, RankList: [], timeType: 2, uid: 0},
  onLoad: function (e) {
    this.setMenu(this);
    app.globalData.getTop();
    this.setData({uid: app.globalData.UserInfo.Id}), this.getRanklist();
  },
  weekrank: function () {
    this.setData({tapindex: 1, RankList: [], timeType: 2, ispage: !1}), this.getRanklist();
  },
  monthrank: function () {
    this.setData({tapindex: 2, RankList: [], timeType: 3, ispage: !1}), this.getRanklist();
  },
  totalrank: function () {
    this.setData({tapindex: 3, RankList: [], timeType: 1, ispage: !1}), this.getRanklist();
  },
  getRanklist: function () {
    var e = {timeType: this.data.timeType}, t = this;
    $.xsr($.makeUrl(userapi.getDistributionRankingList, e), function (e) {
      console.log(e), e.errcode == 0 ? (t.setData({
        RankList: e.dataList.RankList,
        isShowBnt: e.dataList.isShowBnt,
        ispage: !0
      }), $.isNull(e.dataList.VendorDistributionDesc) || WxParse.wxParse("ranklistrule", "html", e.dataList.VendorDistributionDesc, t)) : t.setData({ispage: !0});
    });
  },
  clickrule: function () {
    this.setData({isShowMsk: !0});
  },
  closemsk: function () {
    this.setData({isShowMsk: !1});
  }
}));