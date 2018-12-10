let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let jd_common = require('../../utils/jd_common');
let WxParse = require("../../wxParse/wxParse.js");
let jdApi = require('../../api/jdAPI');
Page(Object.assign({}, {
  data: {
    numIndex: 0,
    num: 1,
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  onShow() {
    let t = this;
    // 加载订单列表
    t.reloadOrderList();
  },
  // 重新加载订单列表
  reloadOrderList() {
    let t = this;
    let api = jdApi.getOrderList;
    wx.showLoading({title: 'loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.setData({orderList: rd});
        } else {
          wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
        }
      }, fail() {
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 取消预定并退款
  doRefund(e) {
    let t = this, ds = e.currentTarget.dataset;
    let id = ds.id;
    wx.showModal({
      title: '提示',
      content: '确定取消预定吗？',
      success(res) {
        if (res.confirm) {
          // 执行退款操作
          wx.showLoading({title: 'loading', mask: 1});
          let api = jdApi.refund;
          wx.request({
            url: api.url,
            method: api.method,
            data: {
              wid: api.data.wid,
              openid: app.globalData.UserInfo.WeiXinOpenId,
              orderId: id,
            },
            success(resp) {
              let r = resp.data, rd = r.data;
              if (r.status == 'success') {
                t.reloadOrderList();
              } else {
                wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
              }
            }, fail() {
            },
            complete() {
              wx.hideLoading();
            }
          });
        }
      }
    });
  },
  // 评价
  doComment(e) {
    let t = this, ds = e.currentTarget.dataset;
    let id = ds.id;
    let url = `/pages/jd_comment/jd_comment?id=${id}`;
    console.log('跳转到评论', url);
    wx.navigateTo({url: url});
  },
  payOrder(e) {
    let t = this, ds = e.currentTarget.dataset;
    let id = ds.id;
    wx.myRequest({
      url: jdApi.payOrder.url,
      method: 'POST',
      data: {
        id: id,
      },
      success: function (resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          rd.success = function () {
            // 跳转到订单中心
            wx.redirectTo({
              url: '/pages/jd_order/jd_order'
            });
          };
          rd.fail = function () {
            wx.showModal({title: '提示', content: '支付未完成，请重新下单', showCancel: 0});
          };
          wx.requestPayment(rd);
        } else {
          wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
        }
      },
    });
  },
  delOrder(e) {
    let t = this, ds = e.currentTarget.dataset;
    let id = ds.id;

    wx.showModal({
      title: "提示", content: "确认删除这个订单吗？", showCancel: !0, success: function (n) {
        if (n.confirm) {


          wx.myRequest({
            url: jdApi.delOrder.url,
            method: 'POST',
            data: {
              id: id,
            },
            success: function (resp) {
              let r = resp.data, rd = r.data;
              if (r.status == 'success') {
                t.reloadOrderList();
                wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
              } else {
                wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
              }
            },
          });


        }
      }
    });


  }
}, templateMethods, jd_common));