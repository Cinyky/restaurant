let cf = require("../config.js");
let apiList={
  // 获取商品列表
  getProductList: {
    url: cf.config.configUrl + "secKill/getProductList.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  // 获取我的订单列表
  getOrderList: {
    url: cf.config.configUrl + "secKill/getOrderList.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //提交订单
  submitOrder: {
    url: cf.config.configUrl + "secKill/submitOrder.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //标记为已收货
  receive:{
    url: cf.config.configUrl + "secKill/receive.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //取消订单
  cancelOrder:{
    url: cf.config.configUrl + "secKill/cancelOrder.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //未支付的订单发起支付
  payOrder:{
    url: cf.config.configUrl + "secKill/payOrder.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
};
module.exports = apiList;