var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {
  data: {
    page: 0,
    hasMore: true,
    list: []
  },
  onLoad: function (option) {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    t.setData({type: option.type});  // 0我回复的 1回复我的
    wx.setNavigationBarTitle({title: option.type == 0 ? '我回复的' : '回复我的'});
    t.loadComment(true);
  },
  loadComment(reload = false) {
    let t = this;
    if (!t.data.hasMore && !reload) {
      return false;
    }
    if (reload) {
      t.setData({
        page: 0,
        hasMore: true,
        list: []
      });
    }
    // 加载数据
    let api = tcApi.getComment;
    wx.showLoading({title: 'Loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        type: t.data.type,
        page:t.data.page,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          let _list = t.data.list;
          _list.push(...rd);
          t.setData({list: _list, page: t.data.page + 1});
          if (rd.length == 0) {
            t.setData({hasMore: false});
          }
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }, fail() {
        wx.showToast({title: '网络异常', mask: 1});
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  onReachBottom: function () {
    this.loadComment()
  },
  onPullDownRefresh: function () {
    this.loadComment(true)
  }
}, templateMethods, tc_common));