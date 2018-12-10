var app = getApp(), $ = require("../../utils/util.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {val: ""},
  onLoad(){
    this.setMenu(this);
  },
  onShow: function () {
    app.globalData.getTop();
  }, startinput: function (e) {
    this.setData({val: e.detail.value});
  }, search: function () {
    var e = this;
    $.isNull(e.data.val) ? $.confirm("请输入你要搜索的关键词!") : wx.redirectTo({
      url: "/pages/search_product/search_product?pname=" + e.data.val,
      fail: function (e) {
        console.log("跳转失败!", e);
      }
    });
  }
}));