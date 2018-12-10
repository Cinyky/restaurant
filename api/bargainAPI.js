let cf = require("../config.js");
module.exports = {
  // 获取商品列表
  getProductList: {
    url: cf.config.configUrl + "bargain/getProductList.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  // 获取我的订单列表
  getOrderList: {
    url: cf.config.configUrl + "bargain/getOrderList.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //提交订单
  submitOrder: {
    url: cf.config.configUrl + "bargain/submitOrder.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //获取订单详细页面(分享页面)
  getOrderDetail:{
    url:cf.config.configUrl + "bargain/getOrderDetail.html",
    data:{
      wid:cf.config.wid
    },
    method:'POST'
  },
  //获取商品详细信息
  getGoodsDetail:{
    url:cf.config.configUrl + "bargain/getGoodsDetail.html",
    data:{
      wid:cf.config.wid
    },
    method:'POST'
  },
  //好友帮砍
  saveHelpKan:{
    url: cf.config.configUrl + "bargain/saveHelpKan.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //购买时，编辑订单，添加信息
  editOrder:{
    url: cf.config.configUrl + "bargain/editOrder.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  // 标记为已收货
  receive:{
    url: cf.config.configUrl + "bargain/receive.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //申请退款
  refundMoney:{
    url: cf.config.configUrl + "bargain/refundMoney.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  }
};