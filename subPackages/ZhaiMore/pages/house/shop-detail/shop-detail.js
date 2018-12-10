// function t(t) {
//     return t && t.__esModule ? t : {
//         default: t
//     };
// }
//
// var e = t(require("../../../utils/dg.js")), a = t(require("../../../utils/data.js")), i = t(require("../../../utils/requestUtil.js")), n = (t(require("../../../utils/underscore.js")),
// t(require("../../../utils/util.js")), a.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse");
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
    data: {
        // isAli: e.default.os.isAlipay(),
        imgUrls: null,
        indicatorDots: !0,
        autoplay: !1,
        interval: 5e3,
        duration: 1e3,
        index: 0,
        // info: null,
        listinfo: null,
        shopid: null,
        resource: !0,
        agent: !1,
        page: 1,
        showing: !1
    },
    onLoad: function(t) {
        // this._initialize(t), this.getlist(t);
      this.setMenu(this);
      app.globalData.getTop(this);
      //获取门店具体信息
      this.getShopDetail(t.id);
      //获取对应经纪人
      this.getShopAgent(t.id);
    },
  //点击房源
  setresourceInit: function(t) {
    this.setData({
      resource:true,
      agent:false
    })
  },
  //点击经纪人
  setagentInit: function(t) {
    this.setData({
      resource:false,
      agent:true
    })
  },
  //拨打电话
  makePhoneCall: function(t) {
    wx.makePhoneCall({
      phoneNumber: t.currentTarget.dataset.mobile || ""
    });
  },
  //查看位置
  openLocation: function(t) {
    // var e = this.data.info, a = e.latitude, i = e.longitude, n = e.cityareaname + " " + e.store_name;
    wx.openLocation({
      latitude: parseFloat(this.data.info.lat),
      longitude: parseFloat(this.data.info.lng),
      address: "",
      name: this.data.info.addr
    });
  },
  //跳转
  navigateTo: function(t) {
    var a = t.currentTarget.dataset.path;
    var i = a + t.currentTarget.dataset.params;
    wx.navigateTo({
      url: i
    });
  }
    // _initialize: function(t) {
    //     var e = this, a = t.id, o = n + "/Store/getdetail", s = {
    //         id: a
    //     };
    //     i.default.post(o, s, function(t) {
    //         e.setData({
    //             info: t,
    //             imgUrls: t.store_photo_url,
    //             shopid: t.id
    //         });
    //     });
    // },
    // getlist: function(t) {
    //     var e = this, a = t.id, o = "/Store/getresource";
    //     e.data.agent && (o = "/Store/getagent");
    //     var s = n + o, r = {
    //         id: a
    //     };
    //     i.default.post(s, r, function(t) {
    //         e.setData({
    //             listinfo: t
    //         });
    //     });
    // },
    // setresourceInit: function(t) {
    //     this.setData({
    //         listinfo: [],
    //         page: 0
    //     });
    //     var e = {};
    //     e.showing = !0, this.setresource(e);
    // },
  
    // setresource: function(t) {
    //     var e = !!t.showing && t.showing, a = this;
    //     a.setData({
    //         resource: !0,
    //         agent: !1
    //     });
    //     var o = n + "/Store/getresource", s = a.data.shopid, r = 1;
    //     e && (r = a.data.page + 1);
    //     var u = {
    //         id: s,
    //         page: r
    //     };
    //     i.default.post(o, u, function(t) {
    //         t && a.setData({
    //             listinfo: 1 === r ? t : a.data.listinfo.concat(t),
    //             page: r
    //         });
    //     });
    // },
    
    // setagent: function(t) {
    //     var e = !!t.showing && t.showing, a = this;
    //     a.setData({
    //         resource: !1,
    //         agent: !0
    //     });
    //     var o = n + "/Store/getagent", s = a.data.shopid, r = 1;
    //     e && (r = a.data.page + 1);
    //     var u = {
    //         id: s,
    //         page: r
    //     };
    //     i.default.post(o, u, function(t) {
    //         t && a.setData({
    //             listinfo: 1 === r ? t : a.data.listinfo.concat(t),
    //             page: r
    //         });
    //     });
    // },
   
    // navigateToResource: function(t) {
    //     var a = "../detail/detail?id=" + t.currentTarget.dataset.id;
    //     e.default.navigateTo({
    //         url: a
    //     });
    // },
   
    // onReady: function() {},
    // onShow: function() {},
    // onHide: function() {},
    // onUnload: function() {},
    // onPullDownRefresh: function() {},
    // onReachBottom: function() {
    //     var t = this, e = {};
    //     e.showing = !0, t.data.resource && t.setresource(e), t.data.agent && t.setagent(e);
    // },
    // onShareAppMessage: function() {
    //     return {
    //         title: this.data.info.store_name,
    //         desc: this.data.info.cityareaname,
    //         path: this.route + "?id=" + this.data.info.id
    //     };
    // },

}, templateMethods, common));