let cf = require("../config.js");
module.exports = {
  // 获取商品列表
  getProductList: {
    url: cf.config.configUrl + "groupBuy/getProductList.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  // 获取单个商品信息
  getProduct:{
    url: cf.config.configUrl + "groupBuy/getProduct.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //获取正在进行的拼团
  getGroupList:{
    url: cf.config.configUrl + "groupBuy/getGroupList.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  // 获取我的订单列表
  getOrderList: {
    url: cf.config.configUrl + "groupBuy/getOrderList.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //提交订单
  submitOrder: {
    url: cf.config.configUrl + "groupBuy/submitOrder.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  /*
  //获取页面分享信息
  getShareInfo:{
    url: cf.config.configUrl + "groupBuy/getShareInfo.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  }
   */
  //标记为已收货
  receive:{
    url: cf.config.configUrl + "groupBuy/receive.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  }
};