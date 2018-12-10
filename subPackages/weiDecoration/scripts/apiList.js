let cf = require("../../../config.js");
module.exports = {
  getSetting: {
    url: cf.config.configUrl + "wd/getSetting.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getCate: {
    url: cf.config.configUrl + "wd/getCate.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getAuthorList: {
    url: cf.config.configUrl + "wd/getAuthorList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitQuote: {
    url: cf.config.configUrl + "wd/submitQuote.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitDesign: {
    url: cf.config.configUrl + "wd/submitDesign.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getDemo: {
    url: cf.config.configUrl + "wd/getDemo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getImgs: {
    url: cf.config.configUrl + "wd/getImgs.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  markLove: {
    url: cf.config.configUrl + "wd/markLove.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getLove: {
    url: cf.config.configUrl + "wd/getLove.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getAuthor: {
    url: cf.config.configUrl + "wd/getAuthor.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMyDesign: {
    url: cf.config.configUrl + "wd/getMyDesign.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  cancelDesign: {
    url: cf.config.configUrl + "wd/cancelDesign.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};