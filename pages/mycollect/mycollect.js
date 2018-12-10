var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {isdata: !0, dataList: [], X_Start: 0, X_End: 0, T_Id: 0, pageindex: 1, ispage: !0, flag: !0},
  onLoad: function () {
    this.setMenu(this);
    app.globalData.getTop();
    var e = this;
    this.GetCollectionList(function () {
      e.data.dataList.length == 0 ? e.setData({isdata: !1}) : e.setData({isdata: !0});
    });
  },
  cancelCollection: function (e) {
    var t = this;
    wx.showModal({
      title: "提示", content: "确认要取消这个商品吗？", showCancel: !0, success: function (n) {
        if (n.confirm) {
          var r = {proId: e.currentTarget.dataset.id, openId: app.globalData.UserInfo.WeiXinOpenId};
          $.xsr($.makeUrl(userapi.DelUserAttention, r), function (e) {
            t.setData({dataList: [], pageindex: 1}), t.GetCollectionList();
          });
        }
      }
    });
  },
  GetCollectionList: function (e) {
    this.setData({flag: !1});
    var t = {openId: app.globalData.UserInfo.WeiXinOpenId, currentPage: this.data.pageindex, pageSize: 10}, n = this;
    $.xsr($.makeUrl(userapi.GetUserAttention, t), function (t) {
      console.log("收藏列表：", t), t.errcode == 0 ? n.data.pageindex == 1 && t.dataList.length < 8 ? n.setData({
        dataList: n.data.dataList.concat(t.dataList),
        flag: !1,
        ispage: !1
      }) : n.setData({dataList: n.data.dataList.concat(t.dataList), flag: !0, ispage: !0}) : n.setData({
        flag: !1,
        ispage: !1
      }), e && e();
    });
  },
  scrollbottom: function (e) {
    if (this.data.flag) {
      var t = this;
      clearTimeout(n);
      var n = setTimeout(function () {
        t.setData({pageindex: parseInt(t.data.pageindex) + 1}), t.GetCollectionList();
      }, 500);
    }
  },
  gotoProduct: function (e) {
    $.gopage("/pages/goods/goods?id=" + e.currentTarget.dataset.pid);
  },
  removestart: function (e) {
    this.setData({X_Start: e.changedTouches[0].clientX});
  },
  removeload: function (e) {
    this.setData({X_End: e.changedTouches[0].clientX});
  },
  removeend: function (e) {
    this.setData({X_End: e.changedTouches[0].clientX}), this.direction(e.currentTarget.dataset.id);
  },
  direction: function (e) {
    var t = {xstart: this.data.X_Start, xend: this.data.X_End};
    t.xstart > t.xend ? t.xstart - t.xend > 100 && this.setData({T_Id: e}) : this.setData({T_Id: 0});
  }
}
));