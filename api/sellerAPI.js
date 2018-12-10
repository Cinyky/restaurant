let cf = require("../config.js");
module.exports = {
  login: {
    url: cf.config.configUrl + "seller/login.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sellerSetting: {
    url: cf.config.configUrl + "seller/sellerSetting.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  orderSetting: {
    url: cf.config.configUrl + "seller/orderSetting.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  uploadImg: {
    url: cf.config.configUrl + "seller/uploadImg.html",
    data: {},
    method: 'POST'
  },
  orderList: {
    url: cf.config.configUrl + "seller/orderList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getOrderByOrderId: {
    url: cf.config.configUrl + "seller/getOrderByOrderId.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  delivery: {
    url: cf.config.configUrl + "seller/delivery.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  evaluateList: {
    url: cf.config.configUrl + "seller/evaluateList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  reply: {
    url: cf.config.configUrl + "seller/reply.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  toggleEvaluate: {
    url: cf.config.configUrl + "seller/toggleEvaluate.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  ptdetail: {
    url: cf.config.configUrl + "seller/ptdetail.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  msdetail: {
    url: cf.config.configUrl + "seller/msdetail.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  kjdetail: {
    url: cf.config.configUrl + "seller/kjdetail.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};