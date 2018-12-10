let cf = require("../config.js");
module.exports = {
  decodeUserData:{
    url: cf.config.configUrl + "decodeData/decodeUserData.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  }
};