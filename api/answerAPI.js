let cf = require("../config.js");
module.exports = {
  getAnswer: {
    url: cf.config.configUrl + "answer/getAnswer.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitAnswer: {
    url: cf.config.configUrl + "answer/submitAnswer.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getPh: {
    url: cf.config.configUrl + "answer/getPh.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};
