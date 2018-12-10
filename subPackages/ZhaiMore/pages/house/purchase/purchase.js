function e(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var a               = e(require("../../../utils/dg.js")), s = e(require("../../../utils/data.js")), t = e(require("../../../utils/requestUtil.js")), i = e(require("../../../utils/underscore.js")), r = (e(require("../../../utils/util.js")),
s.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse");
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
  data               : {
    listUrl                  : "/ResourceApi/listSell",
    list                     : [],
    list_top                 : [],
    pageNumber               : 1,
    pageSize                 : 20,
    hasMore                  : !0,
    isShowLoading            : !1,
    cityAreaList             : [],
    houseTypeList            : [],
    houseCategoryList        : [],
    houseUseList             : [],
    panel_bg_shade           : "display-hide",
    cityAreaDefault          : -1,
    cityAreaListDisplayClass : "sub-pos",
    cityAreaTitle            : "",
    searchCityAreaField      : "area",
    searchCityAreaValue      : 1e5,
    totalPriceDefault        : -1,
    totalPriceDisplayClass   : "sub-price",
    totalPriceTitle          : "",
    searchTotalPriceField    : "house_total",
    searchTotalPriceValue    : {
      min: 0,
      max: 0
    },
    houseTypeDefault         : -1,
    houseTypeDisplayClass    : "sub-house-style",
    houseTypeTitle           : "",
    searchHouseTypeField     : "house_type",
    searchHouseTypeValue     : {
      id        : 0,
      house_word: "不限"
    },
    moreDisplayClass         : "sub-more",
    houseAreaDefault         : -1,
    searchHouseAreaField     : "house_area",
    searchHouseAreaValue     : {
      min: 0,
      max: 0
    },
    houseAreaList            : [{
      min: 0,
      max: 50
    }, {
      min: 50,
      max: 70
    }, {
      min: 70,
      max: 90
    }, {
      min: 90,
      max: 110
    }, {
      min: 110,
      max: 130
    }, {
      min: 130,
      max: 150
    }, {
      min: 150,
      max: 200
    }, {
      min: 200,
      max: 300
    }, {
      min: 300,
      max: 1e3
    }],
    houseCategoryeDefault    : -1,
    searchHouseCategoryeField: "house_category",
    searchHouseCategoryeValue: {
      id        : 0,
      house_word: "不限"
    },
    houseUseDefault          : -1,
    searchHouseUseField      : "house_use",
    searchHouseUseValue      : {
      id        : 0,
      house_word: "不限"
    },
    SearchList:''
  },
  onLoad             : function (e) {
    this.setMenu(this);
    app.globalData.getTop(this);
    this.initialize(e);
  },
  onHide             : function () {
    this.setData({
      totalPriceDisplayClass  : "sub-price",
      cityAreaListDisplayClass: "sub-pos",
      houseTypeDisplayClass   : "sub-house-style",
      moreDisplayClass        : "sub-more"
    });
  },
  initialize         : function (e) {
    this.getFang();
    //通过adduserinfo获取区域列表，类型列表等
    this.addUserInfo();
    // var a = this, s = r + "/ResourceApi/getRentSearchConfigList", i = {};
    // t.default.get(s, i, function(e) {
    //   a.setData({
    //     cityAreaList: e.cityAreaList,
    //     houseTypeList: e.houseTypeList,
    //     houseCategoryList: e.houseCategoryList,
    //     // houseUseList: e.houseUseList
    //   });
    // });
    // var u = this.getSearch();
    // e = {
    //   pageNumber: 1,
    //   pageSize: this.data.pageSize,
    //   hasMore: !0,
    //   url: this.data.listUrl,
    //   search: u
    // }, this.reachBottom(e);
  },
  //跳转至具体页面
  navigateTo         : function (e) {
    var s = "../detail/detail?id=" + e.currentTarget.dataset.id;
    a.default.navigateTo({
      url : s,
      fail: function (e) {
        a.default.redirectTo({
          url: s
        });
      }
    });
  },
  getPaneBgShadeClass: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    return "display-hide" == this.data.panel_bg_shade ? "" : e ? "" : "display-hide";
  },
  //选择区域
  cityAreaList       : function (e) {
    var a = "sub-pos" == this.data.cityAreaListDisplayClass ? "" : "sub-pos", s = this.getPaneBgShadeClass("" == a);
    this.setData({
      panel_bg_shade          : s,
      cityAreaListDisplayClass: a,
      totalPriceDisplayClass  : "sub-price",
      houseTypeDisplayClass   : "sub-house-style",
      moreDisplayClass        : "sub-more"
    });
  },
  selectCityArea     : function (e) {
    this.setData({
      cityAreaTitle           : e.currentTarget.dataset.name,
      cityAreaListDefault     : e.currentTarget.dataset.index,
      searchCityAreaValue     : e.currentTarget.dataset.id,
      cityAreaListDisplayClass: "sub-pos",
      panel_bg_shade          : "display-hide"
    }), this.search(e);
  },
  //搜索
  search             : function (e) {
    this.setData({
      list         : [],
      pageNumber   : 1,
      pageSize     : 20,
      hasMore      : !0,
      isShowLoading: !1
    });
    var a = this.getSearch(), s = {};
    s = {
      pageNumber: 1,
      pageSize  : this.data.pageSize,
      hasMore   : !0,
      url       : this.data.listUrl,
      search    : a
    }, this.reachBottom(s);
  },
  getSearch          : function (e) {
    return [{
      field: this.data.searchCityAreaField,
      value: this.data.searchCityAreaValue
    }, {
      field: this.data.searchTotalPriceField,
      value: this.data.searchTotalPriceValue
    }, {
      field: this.data.searchHouseTypeField,
      value: this.data.searchHouseTypeValue
    }, {
      field: this.data.searchHouseAreaField,
      value: this.data.searchHouseAreaValue
    }, {
      field: this.data.searchHouseCategoryeField,
      value: this.data.searchHouseCategoryeValue
    }
      // , {
      //   field: this.data.searchHouseUseField,
      //   value: this.data.searchHouseUseValue
      // }
    ];
  },
  
  reachBottom     : function (e) {
    console.log('这是bottom：', e);
    var a = this;
    if (!e.hasMore) return this.setData({
      isShowLoading: !1
    }), !1;
    //获取搜索的结果
    this.getSearchList(e.search,2);
    
    this.setData({
      isShowLoading: !1
    })
    // e.search = JSON.stringify(e.search);
    // var s = r + e.url, u = {
    //   _p: e.pageNumber,
    //   _r: e.pageSize,
    //   search: e.search,
    //   is_top: 1
    // };
    // t.default.get(s, u, function(s) {
    //   var t = a.data.list_top, r = a.data.list;
    //   if (0 != (s = s || []).length) {
    //     var u = [];
    //     (0, i.default)(s).map(function(e, a) {
    //       if ("list_top" != a) return u.push(e), e;
    //       t = e;
    //     }), s = u;
    //   }
    //   r = 1 == e.pageNumber ? s || [] : r.concat(s || []), a.setData({
    //     isShowLoading: !1,
    //     hasMore: !(s.length < a.data.pageSize),
    //     pageNumber: e.pageNumber + 1,
    //     list: r,
    //     nodata: 0 != r.length,
    //     list_top: t
    //   });
    // });
  },
  //选择价格
  totalPrice      : function (e) {
    var a = "sub-price" == this.data.totalPriceDisplayClass ? "" : "sub-price", s = this.getPaneBgShadeClass("" == a);
    this.setData({
      panel_bg_shade          : s,
      totalPriceDisplayClass  : a,
      cityAreaListDisplayClass: "sub-pos",
      houseTypeDisplayClass   : "sub-house-style",
      moreDisplayClass        : "sub-more"
    });
  },
  selectTotalPrice: function (e) {
    var a = e.currentTarget.dataset.min, s = e.currentTarget.dataset.max, t = a + "~" + s;
    0 == a && 0 == s ? t = "不限" : 2500 == a && (t = "2500以上"), this.setData({
      totalPriceTitle       : t,
      totalPriceDefault     : e.currentTarget.dataset.index,
      searchTotalPriceValue : {
        min: a,
        max: s
      },
      totalPriceDisplayClass: "sub-price",
      panel_bg_shade        : "display-hide"
    }), this.search(e);
  },
  //户型选择
  huoseType       : function (e) {
    var a = "sub-house-style" == this.data.houseTypeDisplayClass ? "" : "sub-house-style", s = this.getPaneBgShadeClass("" == a);
    this.setData({
      panel_bg_shade          : s,
      houseTypeDisplayClass   : a,
      cityAreaListDisplayClass: "sub-pos",
      totalPriceDisplayClass  : "sub-price",
      moreDisplayClass        : "sub-more"
    });
  },
  selectHouseType : function (e) {
    var a = e.currentTarget.dataset.id, s = e.currentTarget.dataset.houseWord;
    this.setData({
      houseTypeTitle       : s,
      houseTypeDefault     : e.currentTarget.dataset.index,
      houseTypeDisplayClass: "sub-house-style",
      panel_bg_shade       : "display-hide",
      searchHouseTypeValue : {
        id        : a,
        house_word: s
      }
    }), this.search(e);
  },
  //更多选择
  more            : function (e) {
    var a = "sub-more" == this.data.moreDisplayClass ? "" : "sub-more", s = this.getPaneBgShadeClass("" == a);
    this.setData({
      panel_bg_shade          : s,
      moreDisplayClass        : a,
      cityAreaListDisplayClass: "sub-pos",
      totalPriceDisplayClass  : "sub-price",
      houseTypeDisplayClass   : "sub-house-style"
    });
  },
  //选择面积
  selectHouseArea : function (e) {
    var a = e.currentTarget.dataset.key, s = e.currentTarget.dataset.min, t = e.currentTarget.dataset.max;
    this.setData({
      houseAreaDefault    : a,
      searchHouseAreaValue: {
        min: s,
        max: t
      },
      moreDisplayClass    : "sub-more",
      panel_bg_shade      : "display-hide"
    }), this.search(e);
  }
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
  //     var e = this.getSearch(), a = {
  //         pageNumber: this.data.pageNumber,
  //         pageSize: this.data.pageSize,
  //         hasMore: this.data.hasMore,
  //         url: this.data.listUrl,
  //         search: e
  //     };
  //     this.reachBottom(a);
  // },
  // onShareAppMessage: function() {
  //     return {
  //         title: "租房页面",
  //         desc: "",
  //         path: this.route
  //     };
  // },
  
  
  // selectHouseCategory: function(e) {
  //     var a = e.currentTarget.dataset.key, s = e.currentTarget.dataset.id, t = e.currentTarget.dataset.houseWord;
  //     this.setData({
  //         houseCategoryeDefault: a,
  //         searchHouseCategoryeValue: {
  //             id: s,
  //             house_word: t
  //         },
  //         moreDisplayClass: "sub-more",
  //         panel_bg_shade: "display-hide"
  //     }), this.search(e);
  // },
  // selectHouseUse: function(e) {
  //     var a = e.currentTarget.dataset.key, s = e.currentTarget.dataset.id, t = e.currentTarget.dataset.houseWord;
  //     this.setData({
  //         houseUseDefault: a,
  //         searchHouseUseValue: {
  //             id: s,
  //             house_word: t
  //         },
  //         moreDisplayClass: "sub-more",
  //         panel_bg_shade: "display-hide"
  //     }), this.search(e);
  // },
  // shadeHidden: function(e) {
  //     this.setData({
  //         panel_bg_shade: "display-hide",
  //         moreDisplayClass: "sub-more",
  //         cityAreaListDisplayClass: "sub-pos",
  //         totalPriceDisplayClass: "sub-price",
  //         houseTypeDisplayClass: "sub-house-style"
  //     });
  // },
  
  
}, templateMethods, common));