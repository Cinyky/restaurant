let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let jd_common = require('../../utils/jd_common');
let jdApi = require('../../api/jdAPI');
Page(Object.assign({}, {
  data: {
    star: -1,
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    let id = options.id;
    t.getOrder(id, function (order) {
    });
  },
  // 选择评分
  selectStar(e) {
    let t = this, ds = e.currentTarget.dataset;
    let val = ds.val;
    console.log(val);
    t.setData({
      star: parseInt(val),
    });
  },
  // 提交评论
  bindSubmitComment(e) {
    let t = this;
    let content = e.detail.value.content;
    let star = t.data.star;
    if (star < 0) {
      wx.showModal({
        title: '提示',
        content: '请选择评分',
      });
      return false;
    } else if (content == '') {
      wx.showModal({
        title: '提示',
        content: '请输入评价内容',
      });
      return false;
    }
    // 提交评价
    wx.showLoading({title: 'loading', mask: 1});
    let api = jdApi.submitComment;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        orderId: t.data.order.id,
        star: star,
        content: content,
      },
      success: function (resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        wx.showModal({
          title: '提示',
          content: r.msg,
          showCancel: 0,
          success() {
            if (r.status == 'success') {
              wx.navigateBack();
            }
          }
        });

      }, complete() {
        wx.hideLoading();
      }
    });
  }
}, templateMethods, jd_common));