let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let jd_common = require('../../utils/jd_common');
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 获取位置信息并加载酒店列表
  initPage() {
    let t = this;
    // 获取位置信息
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        t.getSetting(function () {
          t.getJdList(latitude, longitude);
        });
      }, fail() {
        wx.showModal({
          title: '提示',
          content: '请打开位置信息权限',
          success(r) {
            if (r.confirm) {
              wx.openSetting({
                success() {
                  t.initPage();
                }
              });
            }
          }
        });
      }
    });
  },
  onShow: function () {
    let t = this;
    // 获取&刷新酒店列表
    t.initPage();
  },
  // 跳转到酒店详情
  bindRedirectToJdDetail(e) {
    let t = this, ds = e.currentTarget.dataset, id = ds.id, idx = ds.idx;
    let jdItem = t.data.jdList[idx];
    console.log(jdItem);
    if (jdItem.status != 1) {
      wx.showModal({title: '提示', content: '酒店暂停营业中，请稍后访问', showCancel: 0});
    } else {
      // 正常跳转到酒店详情页面
      let url = '/pages/jd_detail/jd_detail?id=' + id;
      wx.navigateTo({
        url: url,
      });
    }
  }
}, templateMethods, jd_common));