const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const cfAPI = require("../../api/customFormAPI");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, {
  data: {
    recordList: null,//填写过的表单列表
  },
  onLoad() {
    let t = this;
    app.globalData.getTop();
    this.setMenu(this);
    this.loadData();
  },
  loadData() {
    let t = this;
    const api = cfAPI.getDataList;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      method: 'POST',
      success(resp) {
        let rData = resp.data;
        let recordList = rData.data;
        console.log(rData);
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: false,
            success() {
              wx.navigateBack();
            }
          });
        } else {
          t.setData({
            recordList: recordList,
          });
        }
      }
    });
  },
  reloadData() {
    let t = this;
    t.setData({recordList: null});
    this.loadData();
  },
  Return_H: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  payForm(e) {
    let t = this, ds = e.currentTarget.dataset;
    let api = cfAPI.payForm;
    wx.showLoading({title: '准备支付', mask: true});
    wx.request({
      url: api.url,
      data: {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        wid: api.data.wid,
        dataId: ds.id,
      },
      method: 'POST',
      success: function (resp) {
        resp = resp.data;
        if (resp.status == 'success') {
          console.log(resp);
          let payObj = resp.data;
          payObj.success = function (resp) {
            wx.showModal({
              title: '成功',
              content: resp.msg || td.form.submit_tip.success || '提交成功',
              showCancel: false,
              success: function () {
                t.reloadData();
              }
            });
          };
          payObj.fail = function () {
            wx.showModal({
              title: '提示',
              content: '提交成功但未支付，请稍后重试',
              showCancel: false,
              success: function () {
                t.reloadData();
              }
            });
          };
          wx.requestPayment(payObj);
        } else {
          wx.showModal({title: '提示', 'content': resp.msg, showCancel: false});
        }
      },
      complete() {
        wx.hideLoading();
      }
    });
  }
}, templateMethods));