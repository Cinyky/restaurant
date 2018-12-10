var cf = require("../config.js");
module.exports = {
  SubmitOrders: {
    url: cf.config.configUrl + "shoppingcartWebService/AddOrderDetail.html",
    post: {wid: cf.config.wid, openId: "?", ShoppingCartList: "?", couponItemId: "?", addressId: "?", remark: "?"}
  },
  GetOrderList: {
    url: cf.config.configUrl + "orderWebService/GetOrderList.html",
    post: {wid: cf.config.wid, openId: "?", num: 1, currentPage: "?", pageSize: "?", type: "?"}
  },
  GetOrderInfo: {
    url: cf.config.configUrl + "orderWebService/GetOrderByOrderId.html",
    post: {wid: cf.config.wid, orderid: "?", openId: "?"}
  },
  CloseOrderByOrderId: {
    url: cf.config.configUrl + "orderWebService/CloseOrderByOrderId.html",
    post: {wid: cf.config.wid, orderid: "?"}
  },
  GetWeiXinPrePayNum: {
    url: cf.config.configUrl + "orderWebService/GetWeiXinPrePayNum.html",
    post: {wid: cf.config.wid, orderid: "?", openId: "?"}
  },
  UpdateOrderByOrderId: {url: cf.config.configUrl + "orderWebService/UpdateOrderByOrderId.html", post: {orderid: "?"}},
  ExpressQuery: {url: cf.config.configUrl + "shoppingcartWebService/ExpressQuery.html", post: {OrderNum: "?"}},
  OrderSubmitMessage: {
    url: cf.config.configUrl + "TemplateMsgList/OrderSubmitMessage.html",
    post: {wid: cf.config.wid, orderid: "?"}
  },
  OrderPaySuccessWXMessage: {
    url: cf.config.configUrl + "TemplateMsgList/OrderPaySuccessWXMessage.html",
    post: {wid: cf.config.wid, orderid: "?"}
  },
  selectAddressInfo: {
    url: cf.config.configUrl + "userWebService/selectAddressInfo.html",
    post: {
      wid: cf.config.wid,
      cityName: "?",
      countyName: "?",
      provinceName: "?",
      detailInfo: "?",
      errMsg: "?",
      userName: "?",
      nationalCode: "?",
      postalCode: "?",
      telNumber: "?",
      openId: "?"
    }
  },
  // 评论页面获取订单和商品参数
  GetOrderToEvaluate: {
    url: cf.config.configUrl + "orderWebService/GetOrderToEvaluate.html",
    post: {wid: cf.config.wid, openid: "?", orderid: '?'}
  },
  // 提交评论
  SubmitOrderEvaluate: {
    url: cf.config.configUrl + "orderWebService/SubmitOrderEvaluate.html",
    post: {wid: cf.config.wid, openid: "?", orderid: '?', evaluations: null}
  },
  // 订单查看评论
  GetOrderWithEvaluate: {
    url: cf.config.configUrl + "orderWebService/GetOrderWithEvaluate.html",
    post: {wid: cf.config.wid, openid: "?", orderid: '?'}
  },
  // 获取支付方式设置
  GetPayType: {
    url: cf.config.configUrl + "orderWebService/GetPayType.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  refundMoney: {
    url: cf.config.configUrl + "orderWebService/refundMoney.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
};