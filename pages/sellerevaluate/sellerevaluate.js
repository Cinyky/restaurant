let app = getApp();
let $ = require("../../utils/util.js");
let templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, templateMethods, {
  data: {
    hasMore: true,
    page: 0,
    eList: [],
    loading: false,
    showReply: false,
    reply_id: null,
    reply_content: '',
  },
  onLoad: function (params) {
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
  },
  onShow() {
    let t = this;
    let td = t.data;
    this.setData({
      page: 0,
      orderList: [],
      hasMore: true,
      loading: false,
    });
    // console.log(this.data.page);
    this.getEvaluateList();
  },
  scrollBottom() {
    let t = this;
    if (t.data.hasMore) {
      t.getEvaluateList();
    }
  },
  getEvaluateList() {
    let t = this;
    let tData = t.data;
    if (tData.loading) {
      return false;
    }
    t.setData({
      loading: true
    });
    // 准备参数
    let page = tData.page;
    let tabIndex = tData.tabIndex;
    // 制作请求OBJ
    let eObj = sellerAPI.evaluateList;
    eObj.data = Object.assign({}, eObj.data, {
      page: page,
    });
    eObj.success = function (resp) {
      let data = resp.data;
      let respList = data.data;
      console.log(respList);
      // 设置参数
      let eList = tData.eList;
      let eList2 = [...eList, ...respList];
      t.setData({
        page: page + 1,
        hasMore: (respList.length != 0),
        eList: eList2,
      });
    };
    eObj.complete = function () {
      wx.hideLoading();
      t.setData({
        loading: false
      });
    };
    wx.showLoading({
      title: '加载中',
      mask: 1
    });
    wx.request(eObj);
  },
  showReply(e) {
    let t = this;
    let td = t.data;
    let eid = e.currentTarget.dataset.id;
    let set = {showReply: true};
    if (td.reply_id != eid) {
      set.reply_id = eid;
      set.reply_content = '';
    }
    this.setData(set);
  },
  hideReply() {
    this.setData({
      showReply: false
    });
  },
  inputReply(e) {
    let value = e.detail.value;
    this.setData({
      reply_content: value
    });
  },
  submitReply() {
    let t = this, td = this.data;
    if (!td.reply_id || !td.reply_content) {
      return false;
    }
    let reqObj = sellerAPI.reply;
    reqObj.data = Object.assign({}, reqObj.data, {
      reply_id: td.reply_id,
      reply_content: td.reply_content
    });
    reqObj.success = function (resp) {
      let data = resp.data;
      wx.showModal({
        title: '提示',
        content: data.msg,
        showCancel: false
      });
      if (data.status == 'success') {
        let idx = null;
        for (let i = 0; i < td.eList.length; ++i) {
          if (td.eList[i].id == td.reply_id) {
            idx = i;
            break;
          }
        }
        if (idx !== null) {
          let eList = td.eList;
          eList[idx].reply_content = td.reply_content;
          t.setData({
            eList: eList
          });
        }
        t.setData({
          showReply: false
        });
      }
    };
    wx.request(reqObj);
  },
  toggleEvaluate(e) {
    let t = this, td = this.data;
    let eid = e.currentTarget.dataset.id;
    if (!eid) {
      return false;
    }
    let reqObj = sellerAPI.toggleEvaluate;
    reqObj.data = Object.assign({}, reqObj.data, {
      eid: eid,
    });
    reqObj.success = function (resp) {
      let data = resp.data;
      wx.showModal({
        title: '提示',
        content: data.msg,
        showCancel: false
      });
      if (data.status == 'success') {
        let idx = null;
        for (let i = 0; i < td.eList.length; ++i) {
          if (td.eList[i].id == eid) {
            idx = i;
            break;
          }
        }
        if (idx !== null) {
          let eList = td.eList;
          eList[idx].is_show = (eList[idx].is_show==1?0:1);
          t.setData({
            eList: eList
          });
        }
      }
    };
    wx.request(reqObj);
  }
}));