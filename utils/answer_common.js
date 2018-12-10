let app = getApp();
let myTools = require('../utils/myTools');
let ansApi = require('../api/answerAPI');
module.exports = {
  getAnswer(aid, with_questions = false, callback = null) {
    let t = this;
    let api = ansApi.getAnswer;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        aid: aid,
        share_user: t.data.share_user || null,
        with_questions: with_questions
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({answer: rd});
        callback && callback(rd);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  // 点击进入开始dati
  bindStartAnswer(e) {
    let t = this, answer = t.data.answer;
    if (!answer.can_start) {
      wx.showModal({
        title: '提示',
        content: '活动未开启',
        showCancel: 0
      });
      return false;
    }
    // 其他判断或提示
    if (answer.info.join_count == 0) {
      wx.showModal({
        title: '提示',
        content: '次数不足',
        showCancel: 0
      });
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '开始dati后将使用一次机会，dati中切勿离开，中途退出将失去资格，确定开始吗？',
      success(res) {
        if (res.confirm) {
          // 开始进入游戏
          wx.navigateTo({
            url: `/pages/answer_main/answer_main`
          });
        }
      }
    });
  },
};