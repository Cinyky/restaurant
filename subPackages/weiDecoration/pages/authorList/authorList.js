let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let api = require('../../scripts/apiList');
let common = require('../../scripts/common');
let apiList = require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    config: require('../../scripts/config'),
    authorList:[],
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.getSetting(function (setting) {
      t.getAuthorList(function (cate) {

      });
    });
  },
}, templateMethods, common));
