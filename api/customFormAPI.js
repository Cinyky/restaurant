let cf = require("../config.js");
module.exports = {
  getForm: {
    url: cf.config.configUrl + "customform/getForm.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitForm: {
    url: cf.config.configUrl + "customform/submitForm.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getDataList: {
    url: cf.config.configUrl + "customform/getDataList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  payForm: {
    url: cf.config.configUrl + "customform/payForm.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};