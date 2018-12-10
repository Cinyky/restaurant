let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let answer_common = require('../../utils/answer_common');
let ansApi = require('../../api/answerAPI');
Page(Object.assign({}, {
  data: {
    userList: [],
    tab: 0,
    page: 0,
    hasMore: true
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    let aid = wx.getStorageSync('answer_id');
    t.setData({
      aid: aid,
      head_img_url: app.globalData.UserInfo.photo,
      nickname: app.globalData.UserInfo.NickName,
    });
    t.getAnswer(t.data.aid, false, function (item) {
      // 处理活动剩余时间
      t.setData({
        etime: parseInt(Date.parse(item.etime) / 1000)-parseInt(Date.parse(new Date())/1000)
      });
      t.solveEtime();
    });
  },
  solveEtime() {
    let t = this;
    let itv=setInterval(function () {
      let e = this.data.etime;
      let time_res = [];
      time_res.push(parseInt(e / 86400));
      e = e % 86400;
      time_res.push(parseInt(e / 3600));
      e = e % 3600;
      time_res.push(parseInt(e / 60));
      time_res.push(e % 60);
      this.setData({
        _etime:time_res,
        etime:this.data.etime-1
      });
    }.bind(t), 1000);
    t.setData({
      itv:itv
    })
  },
  onShow() {
    let t = this;
    t.loadList();
  },
  onHide(){
    clearInterval(this.data.itv);
    console.log('清除计时器');
  },
  onUnload(){
    clearInterval(this.data.itv);
    console.log('清除计时器');
  },
  // 加载列表
  loadList() {
    let t = this;
    if (!t.data.hasMore) {
      return false;
    }
    let api = ansApi.getPh;
    wx.showLoading({title: 'loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        aid: t.data.aid,
        page: t.data.page,
        my_share: t.data.tab != 0
      }, success: function (resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
        } else {
          let hasMore = rd.length != 0;
          t.setData({
            userList: [...t.data.userList, ...rd],
            hasMore: hasMore,
            page: t.data.page + 1
          });
        }
      }, fail: function () {
        wx.showModal({title: '提示', content: '网络错误', showCancel: false});
      }, complete: function () {
        wx.hideLoading();
      }
    });
  },
  // 返回首页按钮
  returnHome() {
    wx.navigateBack();
  },
  // 分享
  onShareAppMessage() {
    let t = this;
    let path = `/pages/answer_index/answer_index?aid=${t.data.aid}&openid=${app.globalData.UserInfo.WeiXinOpenId}`;
    console.log(path);
    return {
      title: '微dati',
      path: path,
      success() {
        console.log('转发成功');
      }
    };
  },
  // 切换标签
  changeTab(e) {
    let t = this, tab = e.currentTarget.dataset.tab;
    tab = parseInt(tab);
    t.setData({
      tab: tab,
      page: 0,
      hasMore: true,
      userList: [],
    });
    t.loadList();
  },
  //到底部自动加载下一页
  onReachBottom() {
    let t = this;
    t.loadList();
  },
}, templateMethods, answer_common));