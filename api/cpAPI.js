let cf = require("../config.js");
module.exports = {
  getSetting: {
    url: cf.config.configUrl + "customPage/getSetting.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getImgList: {
    url: cf.config.configUrl + "customPage/getImgList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitLy: {
    url: cf.config.configUrl + "customPage/submitLy.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getContentList: {
    url: cf.config.configUrl + "customPage/getContentList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getContent: {
    url: cf.config.configUrl + "customPage/getContent.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMenuList: {
    url: cf.config.configUrl + "customPage/getMenuList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};
