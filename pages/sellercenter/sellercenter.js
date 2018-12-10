const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, {
  data: {},
  onLoad() {
    this.setMenu(this);
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({
        url: '/pages/sellerlogin/sellerlogin'
      });
    }
  },
  onShow: function() {
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    this.setData({
      __wechat_main_color: a.selectedColor
    });
  },
  logout() {
    wx.removeStorageSync('seller_username');
    wx.removeStorageSync('seller_password');
    wx.removeStorageSync('seller_login_flag');
    wx.redirectTo({
      url: '/pages/sellerlogin/sellerlogin'
    });
  },
  scancode: function() {
    console.log('123');
    wx.scanCode({
      success: (res) => {
        let res_data = res;
        console.log(res_data);
        wx.showModal({
          title: '扫码提示',
          content: '确定要查看核销信息？',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              console.log(res_data)
              wx.navigateTo({
                url: '/pages/activitiesrorderdetail/activitiesrorderdetail?orderid=' + res_data.result,
              })
            } else if (res.cancel) {
              wx.redirectTo({
                url: '/pages/sellercenter/sellercenter'
              });
            }
          }
        })
      }
    })
  },
  testpage: function() {
    wx.navigateTo({
      url: '/pages/activitiesrorderdetail/activitiesrorderdetail',
    })
  }
}, templateMethods));