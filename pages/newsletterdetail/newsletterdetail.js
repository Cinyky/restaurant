var app = getApp(),
  $ = require("../../utils/util.js"),
  WxParse = require("../../wxParse/wxParse.js"),
  activityapi = require("../../api/activityAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, templateMethods, {
  data: {
    dataList: [],
    Id: 0,
    flag: !0,
    activitydetail: [],
    comment_input: '',
  },
  onLoad: function (e) {
    var t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    this.setData({
      Id: e.id
    }),
      this.GetNewsletter();
    try {
      var t = wx.getSystemInfoSync();
      this.setData({
        windowHeight: t.windowHeight
      });
    } catch (n) {
      console.log(" Do something when catch error");
    }
    // this.GetNewsletterList(), this.GetNewsletterCategory()
  },
  inputComment(e) {
    this.setData({
      comment_input: e.detail.value,
    });
  },
  submitComment(e) {
    let t = this;
    wx.myRequest({
      url: activityapi.submitComment.url,
      method: 'POST',
      data: {
        id: t.data.Id,
        comment: t.data.comment_input,
      },
      success(resp) {
        let r = resp.data;
        if (r.status === 'success') {
          wx.showToast({
            title: '提交成功',
          });
          t.setData({
            comment_input: '',
          });
          t.GetNewsletter();
        } else {
          wx.showToast({
            title: r.msg || '提交失败',
          });
        }
      },
    });
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

            markers: [{
              iconPath: "/assets/others.png",
              id: 0,
              latitude: e.dataList.lat,
              longitude: e.dataList.lon,
              width: 50,
              height: 50
            }],
            video: e.dataList.video,
            httpsurl: e.dataList.httpsurl,
            Content: e.dataList.Content.replace(/<img/g, '<img style="width:100%;height:auto"'),
            comment_list:e.dataList.comment_list,
          })),
          console.log(t.data.Content);
        wx.setNavigationBarTitle({
          title: t.data.dataList.Title
        });
      });
  },
  // Return_H: function () {
  //   wx.reLaunch({
  //     url: '/pages/index/index',
  //   })
  // },

  /**
   * 用户点击分享按钮或右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.dataList.Title,
      path: '/pages/newsletterdetail/newsletterdetail?id=' + that.data.Id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    };
  }
}));