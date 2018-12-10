let cf = require("../config.js");
module.exports = {
  smsCode:{
    url: cf.config.configUrl + "sms/smsCode.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  }
};