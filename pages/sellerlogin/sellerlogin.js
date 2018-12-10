const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, {
  data: {},
  onLoad() {
    this.setMenu(this);
    app.globalData.getTop();
    // 如果已经登录，跳转到登陆后页面
    if (wx.getStorageSync('seller_login_flag') != '') {
      wx.redirectTo({
        url: '/pages/sellercenter/sellercenter'
      });
    }
  },
  onShow: function () {
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    this.setData({ __wechat_main_color: a.selectedColor });
  },
  loginSubmit(e) {
    let t = this;
    let values = e.detail.value;
    let username = values.username;
    let password = values.password;
    console.log(username, password);
    if (username == '' || password == '') {
      wx.showModal({
        title: '提示',
        content: '请输入账户和密码',
        showCancel: 0
      });
      return false;
    } else {
      // 执行验证登录操作
      let apiObj = sellerAPI.login;
      apiObj.data = Object.assign({}, apiObj.data, {
        username: username,
        password: password
      });
      apiObj.success = function(resp) {
        console.log(resp);
        let data = resp.data;
        console.log(data);
        if (data.status == 'success') {
          // 设置登录标志
          wx.setStorageSync('seller_username', username);
          wx.setStorageSync('seller_password', password);
          wx.setStorageSync('seller_login_flag', username);
          // 跳转页面
          wx.redirectTo({
            url: '/pages/sellercenter/sellercenter'
          })
        } else {
          wx.showModal({
            title: '错误',
            content: data.msg,
            showCancel: false
          });
        }
      };
      wx.request(apiObj);
    }
  }
}, templateMethods));