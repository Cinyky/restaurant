var app             = getApp();
let moreshop_common = require('../../utils/moreshop_common');
let templateMethods = require("../../utils/template_methods.js");
let moreshopApi     = require('../../api/moreshopApi');

Page(Object.assign({}, {
  data       : {},
  onLoad     : function (option) {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    //获取到的门店id
    console.log(option.id);
    t.setData({
      shopid:option.id
    });
    //获取门店具体信息
    t.getShopInfo(option.id);
  },
  // 拨打电话
  onCallTap(e) {
    let t   = this, ds = e.currentTarget.dataset;
    let tel = ds.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    });
  },
  //跳转至优惠买单
  toPaycheap : function (e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/moreshop_paycheap/moreshop_paycheap?shopid=" + e.currentTarget.dataset.id
    })
  },
  //跳转至商品列表
  toGoodsList: function (e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/moreshop_goodslist/moreshop_goodslist?shopid=" + e.currentTarget.dataset.id
    })
  },
  //跳转至订单页面
  bind_myorder: function () {
    wx.navigateTo({
      url:"/pages/moreshop_orderlist/moreshop_orderlist?shopid="+this.data.shopid
    })
  }
}, templateMethods, moreshop_common));