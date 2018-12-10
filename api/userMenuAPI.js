let cf = require("../config.js");
module.exports = {
  get: {
    url: cf.config.configUrl + "user_menu_mgr/get.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  set: {
    url: cf.config.configUrl + "user_menu_mgr/set.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};