var app = getApp(), 
$ = require("../../utils/util.js"), 
cf = require("../../config.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: { 
    VendorInfo: {} ,
    markers: [{}],
  }, 
  onLoad: function () {
    this.setMenu(this);
      var that = this; 
      app.globalData.getTop();
      that.setData({ 
        VendorInfo: app.globalData.VendorInfo,
        markers:[{
          latitude: app.globalData.VendorInfo.WapLat,
          longitude: app.globalData.VendorInfo.WapLng,
          iconPath: '/assets/others.png',
          title: app.globalData.VendorInfo.ShopName,
          width: 28,
          height: 28
        }]
      }) 
    }, 
  call: function () { 
    wx.makePhoneCall({ 
      phoneNumber: this.data.VendorInfo.LegalNumber 
      }) 
  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.VendorInfo.ShopName,
      desc: app.globalData.VendorInfo.VendorInfo,
      path: "/pages/aboutmerchant/aboutmerchant?uid=" + app.globalData.UserInfo.Id
    }
  }
})
);