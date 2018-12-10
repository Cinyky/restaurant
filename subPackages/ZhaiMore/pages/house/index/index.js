let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');

Page(Object.assign({}, {
  data              : {
    // isAli         : t.default.os.isAlipay(),
    swiper        : {
      indicatorDots: !0,
      autoplay     : !0,
      interval     : 3e3,
      duration     : 1e3
    },
    swiperUrls    : [],
    jumpSwiperUrls: [],
    iconList      : {
      rent           : "http://www.ixiaochengxu.cc/resource/images/house/second/rent-house.png",
      purchase       : "http://www.ixiaochengxu.cc/resource/images/house/second/purchase-house.png",
      new_house      : "http://www.ixiaochengxu.cc/resource/images/house/second/new-house.png",
      shop           : "http://www.ixiaochengxu.cc/resource/images/house/second/shop.png",
      agent          : "http://www.ixiaochengxu.cc/resource/images/estate-category-icons/agencer.png",
      regist         : "http://www.ixiaochengxu.cc/resource/images/house/second/regist.png",
      rent_out_regist: "http://www.ixiaochengxu.cc/resource/images/house/second/rent-out-regist.png",
      sell_regist    : "http://www.ixiaochengxu.cc/resource/images/house/second/sell-regist.png",
      rent_in_regist : "http://www.ixiaochengxu.cc/resource/images/house/second/rent-in-regist.png",
      purchase_regist: "http://www.ixiaochengxu.cc/resource/images/house/second/purchase-regist.png"
    },
    tabList       : {
      rent           : "租房",
      purchase       : "买房",
      new_house      : "新房",
      shop           : "门店",
      agent          : "经纪人",
      regist         : "登记",
      rent_out_regist: "出租发",
      sell_regist    : "出售发",
      rent_in_regist : "求租登记",
      purchase_regist: "求购登记"
    },
    shareInfo     : {},
    index         : "rent_house",
    searchArr     : [{
      name : "rent_house",
      value: "租房"
    }, {
      name : "sell_house",
      value: "买房"
    }],
    pickerIndex   : 0,
    search        : {
      focus      : !1,
      placeholder: "请输入小区名称或地址"
    },
    searchValue   : "",
    listUrl       : "",
    list          : [],
    pageNumber    : 1,
    pageSize      : 20,
    hasMore       : !0,
    isShowLoading : !1,
    isShowLayer   : !1,
    isShowNewHouse: 0
  },
  onLoad            : function (e) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    //新增用户
    t.addUserInfo();
    //获取门店配置
    t.getSetting();
    //获取租房，售房信息
    t.getFang();
  },
  //加入按钮
  bind_livein: function () {
    wx.navigateTo({
      url: '../collect/collect'
    });
  },
  bind_livein2: function () {
    wx.navigateTo({
      url: '../admin/admin'
    });
  },
  tapSelectResource : function (e) {
    var a = e.currentTarget.dataset.index;
    this.setData({
      index:a
    });
    if(a == 'rent_house'){
      // this.setData({
      //   nodata:'true'
      // })
    }else{
      //   this.setData({
      //     nodata:'true'
      //   })
       }
      // if (this.data.index == a){
      //   this.setData({
      //     index:'rent_house'
      //   });
      // }else {
      //   this.setData({
      //     index: 'sell_house'
      //   });
      // }
      // var s = {};
      // s = {
      //   pageNumber: 1,
      //   pageSize  : this.data.pageSize,
      //   hasMore   : !0,
      //   url       : t,
      //   search    : i
      // }, this.reachBottom(s);
    },
  openLayer         : function (e) {
    this.setData({
      isShowLayer: !0
    });
  },
  closeLayer        : function (e) {
    this.setData({
      isShowLayer: !1
    });
  },
  //跳转至出租房屋表单页面
  layerNavigateTo   : function (e) {
    this.setData({
      isShowLayer: !1
    });
    var a = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: a
    });
  },
  //跳转各个页面
  navigateTo        : function (e) {
    var a = e.currentTarget.dataset.url;
    wx.navigateTo({
      url : a,
    })
  },
  //跳转到租房具体页面
  navigateToResource: function (e) {
    var a = "../detail/detail?id=" + e.currentTarget.dataset.id;
    wx.navigateTo({
      url: a
    });
  },
  //跳转到售房
  navigateToNewHouse: function (e) {
    var a = e.currentTarget.dataset.path + e.currentTarget.dataset.param;
    t.default.navigateTo({
      url: a
    });
  },
  // onShareAppMessage : function () {
  //   var e = this.data.shareInfo || {}, a = this.route;
  //   return {
  //     title: e.title || "",
  //     desc : e.desc || "",
  //     path : a
  //   };
  // },
  // initialize        : function (e) {
  //   var t = this, i = o + "/ResourceApi/getIndexParam", r = {};
  //   s.default.get(i, r, function (i) {
  //     var s = t.data.searchArr;
  //     1 == i.isShowNewHouse && s.push({
  //       name : "new_house",
  //       value: "新房"
  //     }), i.pickerIndex = i.house_type, 1 == i.pickerIndex ? i.index = "sell_house" : 2 == i.pickerIndex ? i.index = "new_house" : i.index = "rent_house",
  //       t.setData(a({}, i, {
  //         searchArr: s
  //       }));
  //     var r = t.getListUrl(i.index);
  //     e = {
  //       pageNumber: 1,
  //       pageSize  : t.data.pageSize,
  //       hasMore   : !0,
  //       url       : r,
  //       search    : []
  //     }, t.reachBottom(e);
  //   });
  // },
  // bindPickerChange  : function (e) {
  //   var a = "", t = e.detail.value;
  //   if (this.data.index == this.data.searchArr[t].value) return !1;
  //   (0, r.default)(this.data.searchArr).map(function (e, i) {
  //     i == t && (a = e.name);
  //   }), this.setIndex(a);
  //   var i = this.getListUrl(a), s = [];
  //   this.setData({
  //     list         : [],
  //     pageNumber   : 1,
  //     pageSize     : 20,
  //     hasMore      : !0,
  //     isShowLoading: !1
  //   });
  //   var n = {};
  //   n = {
  //     pageNumber: 1,
  //     pageSize  : this.data.pageSize,
  //     hasMore   : !0,
  //     url       : i,
  //     search    : s
  //   }, this.reachBottom(n);
  // },
  // saveContent       : function (e) {
  //   this.data.isAli || this.setData({
  //     searchValue: e.detail.value
  //   });
  // },
  // blurToSaveContent : function (e) {
  //   this.setData({
  //     searchValue: e.detail.value
  //   });
  // },
  // search            : function (e) {
  //   if ("" == (this.data.searchValue || "")) return t.default.showToast({
  //     title: "输入框内容不能为空！"
  //   }), !1;
  //   this.setData({
  //     list         : [],
  //     pageNumber   : 1,
  //     pageSize     : 20,
  //     hasMore      : !0,
  //     isShowLoading: !1
  //   });
  //   var a = this.getListUrl(this.data.index), i = [];
  //   i     = "new_house" == this.data.index ? [{
  //     name : "search",
  //     value: this.data.searchValue
  //   }, {
  //     name : "is_recommend",
  //     value: 1
  //   }] : [{
  //     field: "index",
  //     value: this.data.searchValue
  //   }];
  //   var s = {};
  //   s = {
  //     pageNumber: 1,
  //     pageSize  : this.data.pageSize,
  //     hasMore   : !0,
  //     url       : a,
  //     search    : i
  //   }, this.reachBottom(s);
  // },
  // reachBottom       : function (e) {
  //   var a = this;
  //   if (!e.hasMore) return this.setData({
  //     isShowLoading: !1
  //   }), !1;
  //   e.search = JSON.stringify(e.search);
  //   var t    = o + e.url, i = {
  //     _p    : e.pageNumber,
  //     _r    : e.pageSize,
  //     search: e.search
  //   };
  //   s.default.get(t, i, function (t) {
  //     var i = a.data.list;
  //     0 != (t = t || []).length && (0, r.default)(t).map(function (e) {
  //       return e.label && (e.labelTextList = e.label.split(",")), e;
  //     }), i = 1 == e.pageNumber ? t || [] : i.concat(t || []), a.setData({
  //       isShowLoading: !1,
  //       hasMore      : !(t.length < a.data.pageSize),
  //       pageNumber   : e.pageNumber + 1,
  //       list         : i,
  //       nodata       : 0 != i.length
  //     });
  //   }, this, {
  //     isShowLoading: !1
  //   });
  // },

 
  // swiperJump        : function (e) {
  //   var a = e.currentTarget.dataset, i = a.houseId || 0, s = a.houseType || 0, r = "";
  //   if (1 == s || 2 == s) {
  //     if (0 == i) return;
  //     r = "/pages/house/detail/detail?id=" + i;
  //   } else {
  //     if (3 != s) return (4 == s || "4" == s) && (r = a.url || "", n.default.webView(r, "VR全景图"),
  //       !1);
  //     if (0 == i) return;
  //     r = "/pages/house/newHouseDetail/newHouseDetail?id=" + i;
  //   }
  //   t.default.navigateTo({
  //     url: r
  //   });
  // }
},templateMethods,common));