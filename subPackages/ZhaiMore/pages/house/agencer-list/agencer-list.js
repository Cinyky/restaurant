// function e(e) {
//     return e && e.__esModule ? e : {
//         default: e
//     };
// }
//
// var a = e(require("../../../utils/dg.js")), t = e(require("../../../utils/data.js")), i = e(require("../../../utils/requestUtil.js")), n = e(require("../../../utils/underscore.js")), u = (e(require("../../../utils/util.js")),
// t.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse");
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
    data: {
        list: [],
        pageNumber: 1,
        pageSize: 20,
        hasMore: !0,
        isShowLoading: !1,
        shareInfo: {}
    },
    onLoad: function(e) {
        // this.initialize(e);
      this.setMenu(this);
      app.globalData.getTop(this);
      //获取经纪人列表
      this.getAgentList();
    },
  //打电话
  makePhoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile || ""
    });
  },
  //跳转至具体经纪人页面
  navigateTo: function(e) {
    var t = "../agencer-detail/agencer-detail";
    t += "?id=" + e.currentTarget.dataset.id || 0, wx.navigateTo({
      url: t,
    });
  },
    // onPullDownRefresh: function() {
    //     this.setData({
    //         list: [],
    //         pageNumber: 1,
    //         pageSize: 20,
    //         hasMore: !0,
    //         isShowLoading: !1
    //     });
    //     var e = {};
    //     this.initialize(e), a.default.stopPullDownRefresh();
    // },
    // onReachBottom: function() {
    //     var e = {
    //         pageNumber: this.data.pageNumber,
    //         pageSize: this.data.pageSize,
    //         hasMore: this.data.hasMore,
    //         url: "/AgentApi/getList"
    //     };
    //     this.reachBottom(e);
    // },
    // onShareAppMessage: function() {
    //     var e = this.data.shareInfo || {};
    //     return {
    //         title: e.title || "",
    //         desc: e.desc || "",
    //         path: "/pages/house/index/index"
    //     };
    // },
    // initialize: function(e) {
    //     var n = this;
    //     e = {
    //         pageNumber: 1,
    //         pageSize: this.data.pageSize,
    //         hasMore: !0,
    //         url: "/AgentApi/getList"
    //     }, this.reachBottom(e), a.default.hideShareMenu(), i.default.get(t.default.duoguan_get_share_data_url, {
    //         mmodule: "duoguan_house"
    //     }, function(e) {
    //         n.setData({
    //             shareInfo: e
    //         }), a.default.showShareMenu();
    //     }, this, {
    //         isShowLoading: !1
    //     });
    // },
    // reachBottom: function(e) {
    //     var a = this;
    //     if (!e.hasMore) return this.setData({
    //         isShowLoading: !1
    //     }), !1;
    //     var t = u + e.url, o = {
    //         _p: e.pageNumber,
    //         _r: e.pageSize
    //     };
    //     i.default.get(t, o, function(t) {
    //         var i = a.data.list;
    //         0 != (t = t || []).length && (0, n.default)(t).map(function(e) {
    //             return e;
    //         }), i = 1 == e.pageNumber ? t || [] : i.concat(t || []), a.setData({
    //             isShowLoading: !1,
    //             hasMore: !(t.length < a.data.pageSize),
    //             pageNumber: e.pageNumber + 1,
    //             list: i,
    //             nodata: 0 != i.length
    //         });
    //     });
    // },


},templateMethods,common));