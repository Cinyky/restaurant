var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this, ts = t.data;
    this.setMenu(this);
    app.globalData.getTop(t);
  },
  onShow: function () {
    let t = this;
    t.loadCateList();
  },
  onNavigateTap: function (e) {
    let t=this,ds=e.currentTarget.dataset;
    let id=ds.id;
    wx.navigateTo({
      url:'/pages/tc_publish/tc_publish?id='+id,
    })
  },
}, templateMethods, tc_common));