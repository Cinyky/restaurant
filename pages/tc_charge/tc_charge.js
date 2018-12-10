var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {

  data: {
    changeList: [],
    user: null,
  },

  onLoad: function (options) {
    let t = this, ts = t.data;
    this.setMenu(this);
    app.globalData.getTop(t);
    // 加载个人信息
    t.loadUser();
    // 加载设置信息
    t.loadSetting();
  },
  bindCharge(e) {
    let t = this, ds = e.currentTarget.dataset, vals = e.detail.value;
    console.log(ds);
    let api = tcApi.recharge;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        recharge_money: ds.recharge_money,
        recharge_num: ds.recharge_num,
      },
      success: resp => {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          // 调起支付
          t.doPayment(rd);
        } else {
          wx.showToast({
            title: r.msg
          });
        }
      }, fail: err => {
        console.log(err);
      }
    });
  },
  doPayment(payObj) {
    let t = this;
    console.log(payObj);
    payObj.success = function () {
      t.loadUser();
    };
    wx.requestPayment(payObj)
  },
}, templateMethods, tc_common));