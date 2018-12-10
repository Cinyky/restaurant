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
var orderApi = require("../../api/orderAPI.js");
Page(Object.assign({}, templateMethods, {
  data: {
    isVip: -1,
  },
  onLoad: function (params) {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    console.log('参数：', params);
    this.setData({
      params: params
    });
    this.vipPay(params);
    console.log(t.data);
  },
  vipPay(params, pay = 0, passwd = '',formId='') {
    let t = this;
    wx.request({
      url: vipApi.vipPay.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        pay: pay,
        passwd: passwd,
        formId:formId
      }, vipApi.vipPay.data, params),
      method: vipApi.vipPay.method,
      success: function (resp) {
        let data = resp.data;
        if (pay == 0) {
          console.log('支付计算', data);
          t.setData(data);
          // 获取金额信息
          if (!data.isVip) {
            wx.showModal({
              title: '提示',
              content: '请先开通会员卡',
              showCancel: 0,
              success: function () {
                wx.navigateTo({
                  url: '/pages/vipcard/vipcard'
                });
              }
            });
            return false;
          }
          if (!data.vipInfo.isset_passwd) {
            wx.showModal({
              title: '提示',
              content: '请先设置支付密码',
              showCancel: 0,
              success: function () {
                wx.navigateTo({
                  url: '/pages/vippasswd/vippasswd'
                });
              }
            });
          }
        } else {
          // 执行支付
          console.log('支付结果', data);
          if (data.status == 'success') {
            wx.request({
              url: vipApi.printing.url, //仅为示例，并非真实的接口地址
              data: {
                orderid: t.data.params.orderid
              },
              method: vipApi.printing.method,
              success: function (res) {
                console.log(res.data)
              }
            })
            // 支付成功
            let redirectUrl = wx.getStorageSync('vip_pay_redirect');
            wx.showModal({
              title: '支付成功',
              content: data.msg,
              showCancel: false,
              success() {
                if (t.data.params.type == "zhct"){
                  wx.redirectTo({ url: '/pages/zhct_orderlist/zhct_orderlist' });
                }else{
                  if (redirectUrl) {
                    wx.redirectTo({ url: redirectUrl });
                  } else {
                    wx.redirectTo({ url: '/pages/index/index' });
                  }
                }
                
              }
            });
          } else {
            // 支付失败
            wx.showModal({
              title: '支付未完成',
              content: data.msg,
              showCancel: false
            });
          }
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
  submitPay(e) {
    let t = this;
    let formId = e.detail.formId;
    console.log(formId);
    let passwd = e.detail.value.passwd;
    if (passwd == '') {
      wx.showModal({
        title: '提示',
        content: '请输入支付密码',
        showCancel: false
      });
      return false;
    }
    // 提交支付
    let params = t.data.params; // params包含支付类型，待支付订单号信息
    t.vipPay(params, 1, passwd,formId); // 1 表示执行支付操作，而不是计算结果
  }
}));