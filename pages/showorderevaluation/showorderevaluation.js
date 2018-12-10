var app = getApp(),
  $ = require("../../utils/util.js"),
  orderapi = require("../../api/orderAPI.js");
Page({
  data: {
    orderInfo: {},
    products: [],
    starNum: [1, 2, 3, 4, 5]
  },
  onLoad: function (params) {
    app.globalData.getTop();
    let that = this;
    const orderId = params['orderid'];
    //接下来请求到订单信息+商品信息
    that.getOrderInfo(orderId);
  },
  // 获取订单和订单所拥有的商品信息
  getOrderInfo(orderid) {
    let that = this;
    const apiInfo = orderapi.GetOrderWithEvaluate;
    const api = {
      url: apiInfo.url,
      data: Object.assign(apiInfo.post, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        orderid: orderid
      }),
      method: 'POST',
      success(resp) {
        const data = resp.data;
        console.log('请求订单和商品信息成功', data);
        that.setData({
          orderInfo: data,
          products: data.items,
        });
      },
      fail() {
        console.log('请求订单和商品信息失败');
      }
    };
    wx.request(api);
  }
});