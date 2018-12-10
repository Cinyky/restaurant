let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let answer_common = require('../../utils/answer_common');
let ansApi = require('../../api/answerAPI');
Page(Object.assign({}, {
  data: {
    show_rule_dialog: false,
    indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    animationData: {},
    answerList: {},
    show_end_dialog: false
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    let aid = wx.getStorageSync('answer_id');
    t.setData({
      aid: aid,
    });
    // 加载活动详情（带题目列表）
    t.getAnswer(aid, true, function (answer) {
      // 题目列表
      let questionList = answer.questionList;
      // 活动题目总数/当前题目/当前题目序号
      let q_count = questionList.length;
      let q_curr_idx = 0;
      // 活动总时间/剩余时间
      let time_limit = answer.time_limit;
      t.setData({
        questionList: questionList,
        q_count: q_count,
        q_curr_idx: q_curr_idx,
        time_limit: time_limit,
      });
      // 设置定时器
      let itv = setInterval(function () {
        this.setData({
          time_limit: this.data.time_limit - 1,
        });
      }.bind(t), 1000);

      t.setData({
        itv: itv
      });
    });
  },
  onShow() {
    let t = this;
  },
  // 单选答案
  radioChange(e) {
    let t = this;
    let answerList = t.data.answerList;
    let q_curr_idx=t.data.q_curr_idx;
    let questionList=t.data.questionList;
    let currQuestion=questionList[q_curr_idx];
    answerList[currQuestion.id] = e.detail.value;
    t.setData({
      answerList: answerList
    });
  },
  // 多选答案
  checkboxChange(e) {
    let t = this;
    let answerList = t.data.answerList;
    let q_curr_idx=t.data.q_curr_idx;
    let questionList=t.data.questionList;
    let currQuestion=questionList[q_curr_idx];
    answerList[currQuestion.id] = e.detail.value;
    t.setData({
      answerList: answerList
    });
  },
  // 下一题按钮
  bindNext() {
    let t = this;
    // 切换下一题操作(可以延迟400执行)
    if (t.data.q_curr_idx + 1 == t.data.questionList.length) {
      // 到最后一题，点击立即提交，关闭计时器，
      clearInterval(t.data.itv);
      // 显示个人信息填写（填写完成个人信息之后，提交答案）
      t.setData({
        show_end_dialog: true,
      });
    } else {
      // 实现动画
      t.doAnimation();
      // 切到下一题
      setTimeout(function () {
        t.setData({
          q_curr_idx: t.data.q_curr_idx + 1
        });
      }, 400);
    }
  },
  // 切换动画
  doAnimation() {
    let t = this;
    let ani = wx.createAnimation({
      timingFunction: 'ease',
      duration: 500,
    });
    ani.opacity(0).step();
    ani.opacity(1).step({duration: 200});
    t.setData({
      animationData: ani
    });
  },
  formSubmit(e) {
    let t = this;
    let vals = e.detail.value;
    let name = vals.name, phone = vals.phone, remark = vals.remark;
    if (name == '' || phone == '') {
      wx.showModal({title: '提示', content: '请填写完整', showCancel: 0});
      return false;
    }
    // 提交答案和用户信息，并返回首页
    let api = ansApi.submitAnswer;
    wx.showLoading({title: 'loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        name: name,
        phone: phone,
        remark: remark,
        aid: t.data.answer.id,
        answerList: t.data.answerList,
        used_time: t.data.answer.time_limit - t.data.time_limit,
      },
      success: function (resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          wx.showModal({
            title: '提示', content: 'dati结束，谢谢参与', showCancel: 0, success: function () {
              wx.redirectTo({url: `/pages/answer_index/answer_index?aid=${t.data.answer.id}`});
            }
          });
        } else {
          wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
        }
      }, fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }, complete() {
        wx.hideLoading();
      }
    });
  },
}, templateMethods, answer_common));