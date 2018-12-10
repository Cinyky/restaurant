var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {
  data: {
    msgList: [],
    type: 0,
    lat: null,
    lng: null,
    show_pay_btn: 0
  },

  onLoad: function (options) {
    let t = this, ts = t.data;
    this.setMenu(this);
    app.globalData.getTop();
    console.log(options);
    t.setData({
      cate_id: options.cate_id || null,
      type: options.type,
      word: options.word || null,
      show_pay_btn: options.show_pay_btn || null,
    });
  },
  onShow: function () {
    let t = this, ts = t.data;
    // 加载设置
    t.loadSetting();
    // 加载当前分类下的消息
    t.loadMsg(true);
  },
  loadMsg(reload = false) {
    let t = this;
    if (t.data.type == 'cate') {
      t.loadMsgByCate(reload);
    } else if (t.data.type == 'search') {
      t.loadMsgByWord(reload);
    } else if (t.data.type == 'my') {
      t.loadMyMsg(reload);
    } else if (t.data.type == 'fav') {
      t.loadMsgByFav(reload);
    }
  },
  loadMsgByFav(reload = false) {
    let t = this, ts = t.data;
    if (!reload && !t.data.hasMore) return false;
    // 清空当前的数据
    if (reload) {
      t.setData({
        msgList: [],
        hasMore: true,
        page: 0
      });
    }
    let api = tcApi.getMsgByFav;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        page: t.data.page,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          let _msgList = t.data.msgList;
          _msgList.push(...rd);
          t.setData({msgList: _msgList, page: t.data.page + 1});
          if (rd.length == 0) {
            t.setData({hasMore: false});
          }
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }
    });
  },
  loadMyMsg(reload = false) {
    let t = this, ts = t.data;
    if (!reload && !t.data.hasMore) return false;
    // 清空当前的数据
    if (reload) {
      t.setData({
        msgList: [],
        hasMore: true,
        page: 0
      });
    }
    let api = tcApi.getMyMsg;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        page: t.data.page,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          let _msgList = t.data.msgList;
          _msgList.push(...rd);
          t.setData({msgList: _msgList, page: t.data.page + 1});
          if (rd.length == 0) {
            t.setData({hasMore: false});
          }
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }
    });
  },
  loadMsgByWord(reload = false) {
    let t = this, ts = t.data;
    if (!reload && !t.data.hasMore) return false;
    // 清空当前的数据
    if (reload) {
      t.setData({
        msgList: [],
        hasMore: true,
        page: 0
      });
    }
    let api = tcApi.getMsgByWord;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        word: t.data.word,
        page: t.data.page,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          let _msgList = t.data.msgList;
          _msgList.push(...rd);
          t.setData({msgList: _msgList, page: t.data.page + 1});
          if (rd.length == 0) {
            t.setData({hasMore: false});
          }
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }
    });

  },
  loadMsgByCate(reload = false) {
    let t = this, ts = t.data;
    if (!reload && !t.data.hasMore) return false;
    // 清空当前的数据
    if (reload) {
      t.setData({
        msgList: [],
        hasMore: true,
        page: 0
      });
    }
    let api = tcApi.getMsgByCate;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        cate_id: t.data.cate_id,
        page: t.data.page,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          let _msgList = t.data.msgList;
          _msgList.push(...rd);
          t.setData({msgList: _msgList, page: t.data.page + 1});
          if (rd.length == 0) {
            t.setData({hasMore: false});
          }
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }
    });

  },
  onReachBottom: function () {
    let t = this;
    t.loadMsg();
  },
}, templateMethods, tc_common));