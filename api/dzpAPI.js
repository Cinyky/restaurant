let cf = require("../config.js");
module.exports = {
  getDzpInfo:{
    url: cf.config.configUrl + "dzp/getDzpInfo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  share:{
    url: cf.config.configUrl + "dzp/share.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  lottery:{
    url: cf.config.configUrl + "dzp/lottery.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  prizeList:{
    url: cf.config.configUrl + "dzp/prizeList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};