let cf = require("../config.js");
module.exports = {
  openCard:{
    url: cf.config.configUrl + "vip/openCard.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getVipInfo:{
    url: cf.config.configUrl + "vip/getVipInfo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  mark:{
    url: cf.config.configUrl + "vip/mark.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  recharge:{
    url: cf.config.configUrl + "vip/recharge.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  vipPay:{
    url: cf.config.configUrl + "vip/vipPay.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  setPasswd:{
    url: cf.config.configUrl + "vip/setPasswd.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  printing: {
    url: cf.config.configUrl + "vip/printing.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};