var app = getApp(), $ = require("../../utils/util.js"), pdapi = require("../../api/productAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {
    viewtype: 1,
    pdlist: [],
    fglist: [],
    sort: 2,
    flag: !0,
    ispage: !0,
    scposition: "",
    istop: !1,
    isdata: !1,
    isFG: !1,
    post: {orderby: 1, sort: 2, isnew: !1, pname: "", cid: 0, pageindex: 1}
  }, onLoad: function (e) {
    this.setMenu(this);
    app.globalData.getTop();
    var t = this;
    this.setData({post: {orderby: 1, sort: 2, pname: e.pname, cid: e.gid, pageindex: 1}}), this.GetPlist(function () {
      t.data.pdlist.length == 0 ? t.setData({isdata: !1}) : t.setData({isdata: !0});
    });
  }, viewType: function (e) {
    this.data.viewtype == 0 ? this.setData({viewtype: 1}) : this.setData({viewtype: 0});
  }, sealnum: function () {
    this.setData({
      pdlist: [],
      post: {orderby: 1, sort: 2, pname: this.data.post.pname, cid: this.data.post.cid, pageindex: 1}
    }), this.GetPlist();
  }, newpd: function () {
    this.setData({
      pdlist: [],
      post: {orderby: 2, sort: 2, pname: this.data.post.pname, cid: this.data.post.cid, pageindex: 1}
    }), this.GetPlist();
  }, pdprice: function () {
    this.data.sort == 1 ? this.setData({
      sort: 2,
      pdlist: [],
      post: {orderby: 3, sort: 2, pname: this.data.post.pname, cid: this.data.post.cid, pageindex: 1}
    }) : this.setData({
      pdlist: [],
      sort: 1,
      post: {orderby: 3, sort: 1, pname: this.data.post.pname, cid: this.data.post.cid, pageindex: 1}
    }), this.GetPlist();
  }, scrollbottom: function (e) {
    if (this.data.flag) {
      var t = this;
      clearTimeout(n);
      var n = setTimeout(function () {
        t.setData({
          post: {
            orderby: t.data.post.orderby,
            sort: t.data.post.sort,
            pname: t.data.post.pname,
            cid: t.data.post.cid,
            pageindex: parseInt(t.data.post.pageindex) + 1
          }
        }), t.GetPlist();
      }, 500);
    }
  }, GetPlist: function (e) {
    this.setData({flag: !1});
    var t = this;
    $.xsr($.makeUrl(pdapi.GetGroupsList, this.data.post), function (n) {
      n.dataList.length > 0 ? t.data.post.pageindex == 1 && n.dataList.length < 10 ? t.setData({
        pdlist: t.data.pdlist.concat(n.dataList),
        flag: !1,
        ispage: !1
      }) : t.setData({pdlist: t.data.pdlist.concat(n.dataList), flag: !0, ispage: !0}) : t.setData({
        flag: !1,
        ispage: !1
      }), e && e();
    });
  }, returnTop: function () {
    this.setData({scposition: 0});
  }
}));