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
var qiyeapi = require("../../api/supercard.js");
Page(Object.assign({}, templateMethods, {
  data: {
    userPhone: null,
    form_name: '',
    form_phone: '',
    form_code: '',
    form_date: '',
    wxPhoneNumber: null,
    showVerify: true,
    waitCode: 0,
    isVip: -1,
  },
  onLoad: function () {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    //页面逻辑
    this.setData({
      form_date: getDate(),
      max_form_date: getDate(),
      todayDate: getDate(),
    });

    //发送企业微信提示
    console.log('发送企业微信提示');
    t.sendQiYeMessage();
    t.saveEvent(12);
  },



  //发送企业微信通知
  sendQiYeMessage:function(){
    wx.request({
      url: qiyeapi.sendQiYeMessage.url,
      data: Object.assign({}, {
        userInfo: app.globalData.UserInfo,
        type:'vipcard',
        content:'会员卡',
      }, qiyeapi.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
        } else {
          console.log('日志发送失败!');
        }
      }
    })
  },

  saveEvent:function(eventId){
    wx.request({
      url: qiyeapi.saveCardEvent.url,
      data: Object.assign({}, {
        open_id: app.globalData.UserInfo.WeiXinOpenId,
        event_id: eventId,
      }, qiyeapi.saveCardEvent.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          console.log(res.data.msg);
        } else {
          console.log(res.data.msg);
        }
      }
    })
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
          app.GetUserInfo();
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
  onShow() {
    // 刷新登录态，后台存储sessionkey
    this.getVipInfo();
  },
  mark(e) {
    console.log('签到事件', e);
    let t = this;
    wx.request({
      url: vipApi.mark.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        formId: e.detail.formId,
      }, vipApi.mark.data),
      method: vipApi.mark.method,
      success: function (resp) {
        let data = resp.data;
        console.log(data);
        t.setData({
          vipInfo: data.vipInfo
        });
        wx.showModal({
          title: '签到',
          content: data.msg,
          showCancel: 0,
        });
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
  // 日期修改
  bindDateChange(e) {
    this.setData({
      form_date: e.detail.value
    });
  },
  // 获取手机号
  getPhoneNumber(e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      return false;
    }
    wx.request({
      url: decodeDataApi.decodeUserData.url,
      data: Object.assign({}, {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, decodeDataApi.decodeUserData.data),
      method: 'POST',
      dataType: 'json',
      success(resp) {
        let data = resp.data;
        console.log('解密成功', resp.data);
        let phoneNumber = data.phoneNumber;
        console.log(phoneNumber);
        if (phoneNumber) {
          that.setData({
            wxPhoneNumber: phoneNumber,
            showVerify: false,
            form_phone: phoneNumber
          });
        }
      },
      fail() {
        console.log('解密失败');
      }
    });
  },
  // 输入手机号
  phoneInput(e) {
    let newVal = e.detail.value;
    if (this.data.wxPhoneNumber && newVal == this.data.wxPhoneNumber) {
      this.setData({
        form_phone: newVal,
        showVerify: false
      });
    } else {
      this.setData({
        form_phone: newVal,
        showVerify: true
      });
    }
  },
  // 常规表单上输入
  normalInput(e) {
    let key = e.currentTarget.dataset.key;
    let val = e.detail.value;
    this.data[key] = val;
    this.setData(this.data);
  },
  //获取验证码
  getVerifyCode() {
    let t = this;
    if (t.data.waitCode != 0) {
      return false;
    } else if (t.data.form_phone.length != 11) {
      wx.showModal({
        title: '错误',
        content: '手机号码格式不正确',
        showCancel: 0
      });
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
          phone: t.data.form_phone,
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
  //提交表单开卡
  submitFormWrap(e) {
    let formId = e.detail.formId;
    console.log('formId', formId);
    this.submitForm(formId);
  },
  submitForm(formId) {
    // 验证完整性
    console.log(this.data.form_name, this.data.form_date, this.data.form_phone, this.data.wxPhoneNumber)
    if (!this.data.form_name || !this.data.form_date || !this.data.form_phone) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请完整填写',
      });
    }
    let t = this;
    // 提交开卡
    wx.request({
      url: vipApi.openCard.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        name: t.data.form_name,
        phone: t.data.form_phone,
        date: t.data.form_date,
        // code: t.data.form_code,
        // verify: t.data.showVerify,
        formId: formId
      }, vipApi.openCard.data),
      method: vipApi.openCard.method,
      success: function (resp) {
        let data = resp.data;
        console.log(data);
        if (data.status == 'success') {
          wx.showModal({
            showCancel: 0,
            title: '恭喜',
            content: '开卡成功'
          });
          t.getVipInfo();
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
  }
}));