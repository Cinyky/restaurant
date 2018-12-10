var app = getApp();
let zhctApi = require('../../api/zhctAPI');
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {
    canSubmit: false,
  },
  onLoad: function (options) {
    let t = this, ts = t.data;
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
    let orderId = options.orderId;
    t.setData({orderId:orderId});
    let api = zhctApi.getOrder;
    wx.showLoading({
      title: '加载中', mask: true
    });
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        orderId: orderId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          let cart = rd.cart;
          for (let i = 0; i < cart.length; ++i) {
            let item = cart[i];
            item.price = myTools.toMoney(parseFloat(item.sp.price) * parseInt(item.num));
            cart[i] = item;
          }
          rd.cart = cart;
          t.setData({order: rd});
        } else {
          wx.showModal({
            title: '错误',
            content: r.msg,
            showCancel: false
          });
        }
      }, fail() {
        wx.showModal({
          title: '错误',
          content: '网络错误',
          showCancel: false
        });
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 写评论
  bind_input_comment(e) {
    let t = this, td = t.data;
    let val = e.detail.value;
    t.setData({comment: val});
    if (val.length < 8) {
      t.setData({canSubmit: false});
    } else {
      t.setData({canSubmit: true});
    }
  },
  //发表评论
  formSubmit: function () {
    let t = this, td = t.data;
    let api = zhctApi.submitComment;
    wx.showLoading({title: '正在提交', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        comment: td.comment,
        orderId:td.orderId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: false,
            success() {
              wx.navigateBack();
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: false,
          });
        }
      }, fail() {
        wx.showModal({
          title: '提示',
          content: '提交失败，网络错误',
          showCancel: false,
        });
      }, complete() {
        wx.hideLoading();
      }
    });
  },
}, templateMethods));