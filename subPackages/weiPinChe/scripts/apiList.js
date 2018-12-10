let cf = require("../../../config.js");
module.exports = {
  publish: {
    url: cf.config.configUrl + "wpc/publish.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getList: {
    url: cf.config.configUrl + "wpc/getList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getPublished: {
    url: cf.config.configUrl + "wpc/getPublished.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};