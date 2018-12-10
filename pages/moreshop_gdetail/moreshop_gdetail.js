var app             = getApp();
var $               = require("../../utils/util.js");
let moreshopApi     = require("../../api/moreshopApi.js");
let WxParse         = require("../../wxParse/wxParse.js");
let moreshop_common = require('../../utils/moreshop_common');
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {
    product:''
  },
  
  // 加载完成之后
  onLoad: function (options) {
    var that = this;
    this.setMenu(this);
    app.globalData.getTop(that);
    console.log('onload参数', options);
    //上一个页面传来了index参数
    let pageStack = getCurrentPages();
    console.log('当前页面栈', pageStack);
    if (options['index']) {
      console.log('准备直接从上一个页面取出商品信息');
      let prevPage = pageStack[pageStack.length - 2];
      console.log('上一个页面', prevPage);
      let product = prevPage.data.productList[options['index']];
      console.log('对应的商品是', product);
      that.setData({
        product: product
      });
      //解析富文本
      WxParse.wxParse("info", "html", product.intro, that);
    }
    if(options['index']==10){
      that.comment();
    }else{
      //切换到商品详情页
      that.productInfo();
    }
  },
  //商品详情页点击事件
  productInfo: function () {
    let that = this;
    //切换标签
    //重置页面数据
    // that.cleanData();
    that.setData({
      tabIndex: 0,
      page: 1,
      hasMore: 1,
      productInfo: []
    });
    //获取商品信息
    that.setData({
      product: that.data.product
    });
    console.log(that.data.product);
  },
  //切换标签页之评论列表
  comment: function () {
    let that = this;
    //切换标签
    //重置页面数据
    // that.cleanData();
    that.setData({
      tabIndex: 10,
      page: 1,
      hasMore: 1,
      comment: []
    });
    //获取评论
    // that.loadOrder();
  },
  //跳转至订单页面
  bindBuynow: function () {
    wx.navigateTo({
      url:'/pages/moreshop_goodorder/moreshop_goodorder'
    })
  }
}, templateMethods, moreshop_common));