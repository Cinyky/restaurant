var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {

  data: {
    changeList: [],
    user: null,
    tel:null
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
  bindSave(e) {
    let t = this, ds = e.currentTarget.dataset, vals = e.detail.value;
    let api = tcApi.setInfo;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        tel:t.data.tel
      },
      success: resp => {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          wx.showToast({title:r.msg,mask:1})
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
  bindInputPhone(e) {
    let t = this, val = e.detail.value;
    console.log(val);
    t.setData({tel: val});
  }
}, templateMethods, tc_common));