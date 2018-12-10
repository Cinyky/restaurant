function getDate() {
  var nowDate = new Date();
  var year = nowDate.getFullYear();
  var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
    : nowDate.getMonth() + 1;
  var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
    .getDate();
  var dateStr = year + "-" + month + "-" + day;
  return dateStr;
}

var app = getApp();
var $ = require("../../utils/util.js");
var templateMethods = require("../../utils/template_methods.js");
var decodeDataApi = require('../../api/decodeDataAPI');
var vipApi = require('../../api/vipAPI');
var smsApi = require('../../api/smsAPI');
Page(Object.assign({}, templateMethods, {
  data: {
    recharge_money: 0,
    ext_money: 0,
    ext_point: 0
  },
  onLoad: function () {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    //页面逻辑
    this.getVipInfo();
  },
  getVipInfo() {
    let t = this;
    wx.request({
      url: vipApi.getVipInfo.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, vipApi.getVipInfo.data),
      method: vipApi.getVipInfo.method,
      success: function (resp) {
        let data = resp.data;
        console.log(data);
        if (data.isVip) {
          // 保存基本信息
          t.setData({
            isVip: 1,
            vipInfo: data.vipInfo,
            vipSetting: data.vipSetting
          });
        } else {
          t.setData({
            isVip: 0,
            vipSetting: data.vipSetting
          });
        }
      },
      fail() {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '网络服务器错误，请稍后重试'
        });
      }
    });
  },
  // 输入金额
  inputMoney(e) {
    let value = e.detail.value;
    let money = value;
    if (isNaN(value) || value == '' || value < 0) {
      this.setData({
        recharge_money: 0,
        ext_money: 0,
        ext_point: 0
      });
      return false;
    }
    money = parseInt(value);
    if (money > 100000000) {
      money = 100000000;
    }
    // 计算赠送积分
    let set = this.data.vipSetting;
    let num = ~~(money / set.recharge_count);
    this.setData({
      recharge_money: money,
      ext_money: num * set.recharge_money,
      ext_point: num * set.recharge_point
    });
  },
  // 充值
  rechargeWrap(e) {
    let formId = e.detail.formId;
    this.recharge(formId);
  },
  recharge(formId) {
    let t = this;
    if (this.data.recharge_money == 0) {
      return false;
    }
    let data = {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      recharge_money: t.data.recharge_money,
      formId: formId
    };
    let api = vipApi.recharge;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: api.url,
      data: Object.assign({}, data, api.data),
      method: 'POST',
      success: function (resp) {
        console.log('充值反馈', resp);
        wx.requestPayment(Object.assign({}, resp.data, {
          success(resp1) {
            console.log('支付完成', resp1);
          },
          fail(resp2) {
            console.log('支付未完成', resp2);
          },
          complete() {
            wx.navigateBack();
          }
        }));
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  }
}));