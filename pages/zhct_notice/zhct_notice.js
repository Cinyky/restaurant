const app = getApp();
let zhctApi = require('../../api/zhctAPI');
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {},
  onLoad: function () {
    let t = this, td = t.data;
    this.setMenu(this);
    app.globalData.getTop();
    // 获取配色设置
    let main_color = wx.getStorageSync('zhct_main_color');
    if (!main_color) {
      wx.setStorageSync('main_color', '#fe5848');
      main_color = '#fe5848';
    }
    this.setData({
      main_color: main_color
    });
    // 获取配置信息
    let api = zhctApi.getInfo;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid
      },
      method: 'POST',
      success(resp) {
        let rData = resp.data;
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: 0
          });
        } else {
          let setting = rData.data;
          // 处理里面的数字变量,防止view中比较数字出问题
          let num_field_ls = ['wm_min_price', 'wm_radius', 'wm_base_price', 'wm_base_distance', 'wm_ext_price', 'first_order_discount', 'lng', 'lat'];
          for (let i = 0; i < num_field_ls.length; ++i) {
            setting[num_field_ls[i]] = parseFloat(setting[num_field_ls[i]]);
          }
          t.setData({
            setting: setting,
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          mask: 1,
        });
      }
    });
  },
  go_back_bind: function () {
    wx.navigateBack(1);
  }
}, templateMethods));