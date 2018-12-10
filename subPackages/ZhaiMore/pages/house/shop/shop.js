// function e(e) {
//     return e && e.__esModule ? e : {
//         default: e
//     };
// }
//
// var a = e(require("../../../utils/dg")), t = require("../../../utils/data"), i = e(t), o = e(require("../../../utils/requestUtil")), r = e(require("../../../utils/underscore"));
//
// e(require("../../../utils/util")), i.default.duoguan_host_api_url;
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
  data         : {
    // isAli: a.default.os.isAlipay(),
    // baseUrl: t.duoguan_host_api_url + "/index.php/addon/DuoguanHouse",
    listUrl      : "/Store/getList",
    list         : [],
    pageNumber   : 1,
    pageSize     : 20,
    hasMore      : !0,
    isShowLoading: !1
  },
  onLoad       : function (e) {
    this.setMenu(this);
    app.globalData.getTop(this);
    this.getShopInfo();
    // this.initialize(e);
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile || ""
    });
  },
  toshopdetail: function(e) {
    var t = "../shop-detail/shop-detail?id=" + e.currentTarget.dataset.id;
    wx.navigateTo({
      url: t
    });
  }
  // onPullDownRefresh: function() {
  //     this.asPullDownRefresh();
  // },
  // onReachBottom: function() {
  //     this.asReachBottom();
  // },
  // initialize: function(e) {
  //     this.asPullDownRefresh();
  // },
  // asPullDownRefresh: function() {
  //     var e = {
  //         pageNumber: 1,
  //         pageSize: this.data.pageSize,
  //         hasMore: !0,
  //         url: this.data.listUrl,
  //         search: []
  //     };
  //     this.reachBottom(e), a.default.stopPullDownRefresh();
  // },
  // asReachBottom: function() {
  //     var e = {
  //         pageNumber: this.data.pageNumber,
  //         pageSize: this.data.pageSize,
  //         hasMore: this.data.hasMore,
  //         url: this.data.listUrl,
  //         search: []
  //     };
  //     this.reachBottom(e);
  // },
  // reachBottom: function(e) {
  //     var a = this;
  //     if (!e.hasMore) return this.setData({
  //         isShowLoading: !1
  //     }), !1;
  //     e.search = JSON.stringify(e.search);
  //     var t = this.data.baseUrl + e.url, i = {
  //         _p: e.pageNumber,
  //         _r: e.pageSize,
  //         search: e.search
  //     };
  //     o.default.get(t, i, function(t) {
  //         var i = a.data.list;
  //         0 != (t = t || []).length && (0, r.default)(t).map(function(e) {
  //             return e;
  //         }), i = 1 == e.pageNumber ? t || [] : i.concat(t || []), a.setData({
  //             isShowLoading: !1,
  //             hasMore: !(t.length < a.data.pageSize),
  //             pageNumber: e.pageNumber + 1,
  //             list: i
  //         });
  //     }, this, {
  //         isShowLoading: !1
  //     });
  // },
  
}, templateMethods, common));