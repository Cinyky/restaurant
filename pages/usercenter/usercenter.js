var app = getApp();
let $ = require("../../utils/util.js");
var templateMethods = require("../../utils/template_methods.js");
const userMenuApi = require("../../api/userMenuAPI");
Page(Object.assign({}, templateMethods, {
  data: {
    UserInfo: "",
    menuInfo: {},
    loaded:false
  },
  onLoad: function () {
    var t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    // console.log(app),
    var copyright = wx.getStorageSync('copyright');
    this.setData({
      UserInfo: app.globalData.UserInfo,
      copyright: copyright
    });
  },
  onShow() {
    let t=this,td=this.data;
    wx.showLoading({title: 'Loading...', mask: true});
    let api = userMenuApi.get;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        const rData = resp.data;
        const data = rData.data;
        console.log(rData)
        t.setData({list: data,loaded:true});
      },
      complete() {
        wx.hideLoading();
      }
    });
  },
  selectAddress: function () {
    var e = this;
    $.gopage("/pages/shopaddress/shopaddress");
    // wx.chooseAddress({
    //   success: function (e) {
    //     $.gopage("/pages/shopaddress/shopaddress");
    //   },
    //   fail: function (e) {
    //     $.gopage("/pages/shopaddress/shopaddress");
    //   }
    // });
  }
}));