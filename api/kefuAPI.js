let cf = require("../config.js");
module.exports = {
  list:{
    url: cf.config.configUrl + "kefu/list.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sendText:{
    url: cf.config.configUrl + "kefu/sendText.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sendImg:{
    url: cf.config.configUrl + "kefu/sendImg.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMsg:{
    url: cf.config.configUrl + "kefu/getMsg.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  }
};