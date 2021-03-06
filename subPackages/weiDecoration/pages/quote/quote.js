let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let common = require('../../scripts/common');
let wdApi = require("../../scripts/apiList");

Page(Object.assign({}, {
  data: {
    config: require('../../scripts/config'),
    authorList: [],
    region: ["请选择地址"],
    levelMap: [
      {
        id: 0,
        name: '简装'
      }, {
        id: 1,
        name: '精装'
      }, {
        id: 2,
        name: '奢装'
      },
    ],
    level: 0,
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.getSetting(function (setting) {
    });
  },
  bindRegionChange(e) {
    let t = this;
    console.log(e);
    t.setData({
      region: e.detail.value
    });
  },
  formSubmit(e) {
    let t = this, vals = e.detail.value;
    vals.address = vals.address.join('/');
    vals.level = t.data.levelMap[vals.level]['name'];
    console.log(vals);
    let api = wdApi.submitQuote;
    wx.myRequest({
      url: api.url,
      data: vals,
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          wx.showModal({
            title: '提示',
            content: '提交成功，稍后我们会电话联系您',
            showCancel: false,
            success() {
              wx.navigateBack();
            }
          });
        } else {
          wx.showModal({
            title: '错误',
            content: r.msg || '未知错误',
            showCancel: false,
          });
        }
      }
    });
  }
}, templateMethods, common));
