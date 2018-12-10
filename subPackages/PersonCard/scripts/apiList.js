let cf = require("../../../config.js");
module.exports = {
  getCardInfo: {
    url: cf.config.configUrl + "PersonCard/getCardInfo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getUser: {
    url: cf.config.configUrl + "PersonCard/getUser.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitInfo: {
    url: cf.config.configUrl + "PersonCard/submitInfo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};