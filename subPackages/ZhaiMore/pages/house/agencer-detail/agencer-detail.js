function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var t = e(require("../../../utils/dg.js")), a = e(require("../../../utils/data.js")), i = e(require("../../../utils/requestUtil.js")), n = e(require("../../../utils/underscore.js")), o = (e(require("../../../utils/util.js")),
a.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse");
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
  data  : {
    info         : {},
    list         : [],
    pageNumber   : 1,
    pageSize     : 20,
    hasMore      : !0,
    isShowLoading: !1,
    AgentFangList:''
  },
  onLoad: function (e) {
    // this.initialize(e);
    this.setMenu(this);
    app.globalData.getTop(this);
    //获取经纪人具体信息
    console.log("获取到的经纪人的id:",e.id);
    this.getAgentInfo(e.id);
    //获取经纪人对应的房源
    this.getAgentFang(e.id);
  },
  //打电话
  makePhoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile || ""
    });
  },
  //跳转至经纪人首页
  navigateToAgentList: function(e) {
    var a = "../agencer-list/agencer-list";
    wx.navigateTo({
      url: a,
    });
  },
  //跳转至信息具体页面
  navigateTo: function(e) {
    var a = "../detail/detail?id=" + e.currentTarget.dataset.id;
    t.default.navigateTo({
      url: a,
      fail: function(e) {
        t.default.redirectTo({
          url: a
        });
      }
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
  //     var e = {
  //         id: this.data.info.id
  //     };
  //     this.initialize(e), t.default.stopPullDownRefresh();
  // },
  // onReachBottom: function() {
  //     var e = {
  //         pageNumber: this.data.pageNumber,
  //         pageSize: this.data.pageSize,
  //         hasMore: this.data.hasMore,
  //         url: "/ResourceApi/getAgentResourceList",
  //         requestData: {
  //             agent_id: this.data.info.id
  //         }
  //     };
  //     this.reachBottom(e);
  // },
  // onShareAppMessage: function() {
  //     return {
  //         title: this.data.info.agent_name,
  //         desc: this.data.info.agent_description,
  //         path: "/" + this.route + "?id=" + this.data.info.id
  //     };
  // },
  // initialize: function(e) {
  //     var t = this, a = e.id || 0, n = o + "/AgentApi/getInfo", r = {
  //         id: a
  //     };
  //     i.default.get(n, r, function(e) {
  //         t.getAgentResourceList(e);
  //     });
  // },
  // getAgentResourceList: function(e) {
  //     this.setData({
  //         info: e
  //     });
  //     var t = {
  //         pageNumber: 1,
  //         pageSize: this.data.pageSize,
  //         hasMore: !0,
  //         url: "/ResourceApi/getAgentResourceList",
  //         requestData: {
  //             agent_id: e.id
  //         }
  //     };
  //     this.reachBottom(t);
  // },
  // reachBottom: function(e) {
  //     var t = this;
  //     if (!e.hasMore) return this.setData({
  //         isShowLoading: !1
  //     }), !1;
  //     var a = o + e.url, r = {
  //         _p: e.pageNumber,
  //         _r: e.pageSize,
  //         agent_id: e.requestData.agent_id
  //     };
  //     i.default.get(a, r, function(a) {
  //         var i = t.data.list;
  //         0 != (a = a || []).length && (0, n.default)(a).map(function(e) {
  //             return e;
  //         }), i = 1 == e.pageNumber ? a || [] : i.concat(a || []), t.setData({
  //             isShowLoading: !1,
  //             hasMore: !(a.length < t.data.pageSize),
  //             pageNumber: e.pageNumber + 1,
  //             list: i,
  //             nodata: 0 != i.length
  //         });
  //     });
  // },
 


}, templateMethods, common));