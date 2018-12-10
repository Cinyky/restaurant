let cf = require("../config.js");
module.exports = {
  getInfo: {
    url: cf.config.configUrl + "zhct/getInfo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getTableList: {
    url: cf.config.configUrl + "zhct/getTableList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getCateList: {
    url: cf.config.configUrl + "zhct/getCateList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  setTable: {
    url: cf.config.configUrl + "zhct/setTable.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getProdList: {
    url: cf.config.configUrl + "zhct/getProdList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getProd: {
    url: cf.config.configUrl + "zhct/getProd.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getCouponList: {
    url: cf.config.configUrl + "zhct/getCouponList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getCoupon: {
    url: cf.config.configUrl + "zhct/getCoupon.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMyCoupon: {
    url: cf.config.configUrl + "zhct/getMyCoupon.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getYouhui: {
    url: cf.config.configUrl + "zhct/getYouhui.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitOrder: {
    url: cf.config.configUrl + "zhct/submitOrder.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getOrderList: {
    url: cf.config.configUrl + "zhct/getOrderList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sellerGetOrderList: {
    url: cf.config.configUrl + "zhct/sellerGetOrderList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sellerOrderSend: {
    url: cf.config.configUrl + "zhct/sellerOrderSend.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  orderCancel: {
    url: cf.config.configUrl + "zhct/orderCancel.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  orderOK: {
    url: cf.config.configUrl + "zhct/orderOK.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  orderPay: {
    url: cf.config.configUrl + "zhct/orderPay.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getOrder: {
    url: cf.config.configUrl + "zhct/getOrder.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitComment: {
    url: cf.config.configUrl + "zhct/submitComment.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getCommentList: {
    url: cf.config.configUrl + "zhct/getCommentList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitVipOrder: {
    url: cf.config.configUrl + "zhct/submitVipOrder.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  // ai页面留言上传手机号接口
  AddUserPhone: {
    url: cf.config.configUrl + "userWebService/AddUserPhone.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};