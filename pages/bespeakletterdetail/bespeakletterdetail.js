var app = getApp(),
  $ = require("../../utils/util.js"),
  WxParse = require("../../wxParse/wxParse.js"),
  cf = require("../../config.js"),
  activityapi = require("../../api/bespeakivityAPI.js");
Page({
  data: {
    dataList: [],
    Id: 0,
    flag: !0,
    activitydetail: [],
    VendorInfo: {},
  },
  onLoad: function (e) {
    app.globalData.getTop();
    this.setData({
      Id: e.id,
      VendorInfo: app.globalData.VendorInfo
    }),
      this.GetNewsletter()
  },
  GetNewsletter: function () {
    var e = {
      id: this.data.Id
    },
      t = this;
    $.xsr($.makeUrl(activityapi.GetNewsletter, e),
      function (e) {
        console.log(e),
          $.isNull(e.dataList) ? t.setData({
            flag: !1
          }) : (t.setData({
            dataList: e.dataList,
            video: e.dataList.video,
          }), t.data.Content || WxParse.wxParse("bespeakivitydetail", "html", e.dataList.Content, t)),
          wx.setNavigationBarTitle({
            title: t.data.dataList.Title
          })
      })
  },
  /**
   * 用户点击分享按钮或右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.dataList.Title +'-预约服务',
      path: '/pages/bespeakletterdetail/bespeakletterdetail?id=' + that.data.Id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});