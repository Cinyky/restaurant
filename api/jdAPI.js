let cf = require("../config.js");
module.exports = {
  getSetting: {
    url: cf.config.configUrl + "jd/getSetting.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getJdList: {
    url: cf.config.configUrl + "jd/getJdList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getJd: {
    url: cf.config.configUrl + "jd/getJd.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getKf: {
    url: cf.config.configUrl + "jd/getKf.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitOrder: {
    url: cf.config.configUrl + "jd/submitOrder.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getOrderList: {
    url: cf.config.configUrl + "jd/getOrderList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  refund: {
    url: cf.config.configUrl + "jd/refund.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getOrder: {
    url: cf.config.configUrl + "jd/getOrder.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitComment: {
    url: cf.config.configUrl + "jd/submitComment.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  payOrder: {
    url: cf.config.configUrl + "jd/payOrder.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  delOrder: {
    url: cf.config.configUrl + "jd/delOrder.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};
