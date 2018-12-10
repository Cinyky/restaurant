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
    waitCode:0
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
          wx.redirectTo({
            url: '/pages/vipcard/vipcard'
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
  setPasswd(e) {
    console.log(e);
    let values = e.detail.value;
    let api = vipApi.setPasswd;
    api.data = Object.assign({}, api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
    }, values);
    api.success = (resp) => {
      let data = resp.data;
      if (data.status == 'success') {
        wx.showModal({
          title: '成功',
          content: data.msg,
          showCancel: false,
          success() {
            wx.redirectTo({
              url: '/pages/vipcard/vipcard'
            });
          }
        });
      } else {
        wx.showModal({
          title: '错误',
          content: data.msg,
          showCancel: false
        });
      }
    };
    api.complete = () => {
      wx.hideLoading();
    };
    wx.showLoading({
      title: 'Loading'
    });
    wx.request(api);
  },
  //获取验证码
  getVerifyCode() {
    let t = this;
    if (t.data.waitCode != 0) {
      return false;
    } else {
      this.setData({
        waitCode: 60
      });
      wx.showLoading({
        title: '加载中',
      });
      // 发验证码
      wx.request({
        url: smsApi.smsCode.url,
        data: Object.assign({}, {
          phone: t.data.vipInfo.phone,
          openid: app.globalData.UserInfo.WeiXinOpenId,
        }, smsApi.smsCode.data),
        method: 'POST',
        success(resp) {
          let data = resp.data;
          console.log(data);
        },
        complete() {
          wx.hideLoading();
        }
      });
      // 生成定时器
      let itv = setInterval(() => {
        let newTime = t.data.waitCode - 1;
        if (newTime <= 0) {
          clearInterval(itv);
        }
        t.setData({
          waitCode: newTime
        });
      }, 1000);
    }
  },
}));