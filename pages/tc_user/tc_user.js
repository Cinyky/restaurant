// pages/inform/inform.js
var app = getApp();
var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {

  data: {
    menus: [
      {
        type: 'list',
        isshow: true,
        name: 'xxx',
        text: 'ccc',
        menus: [
          {
            link: 'pages/tc_lists/tc_lists?type=my&show_pay_btn=1',
            name: '我的信息',
            text: '我的信息'
          },
          {
            link: 'pages/tc_lists/tc_lists?type=fav',
            name: '我的收藏',
            text: '我的收藏'
          },
          {
            link: 'pages/tc_reply/tc_reply?type=0',
            name: '我的回复',
            text: '我的回复'
          },
          {
            link: 'pages/tc_reply/tc_reply?type=1',
            name: '回复我的',
            text: '回复我的'
          },
        ]
      },
      {
        type: 'line',
        isshow: true,
        menus: [
          {
            link: 'pages/tc_charge/tc_charge',
            name: '充值中心',
            text: '充值中心'
          },
          {
            link: 'pages/tc_set/tc_set',
            name: '设置',
            text: '设置'
          },
        ]
      },
    ]
  },

  onLoad: function (options) {
    let t = this, ts = t.data;
    this.setMenu(this);
    app.globalData.getTop(t);
    // 加载个人信息
    let api = tcApi.getUser;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.setData({
            user: rd,
            });
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }, fail() {
        wx.showToast({title: '网络异常', mask: 1});
      }
    });
    var text_h = "menus[" + 0 + "].text";
    var name_h = "menus[" + 0 + "].name"
    t.setData({
      [text_h]: app.globalData.editData_h.tongcheng + "消息",
      [name_h]: app.globalData.editData_h.tongcheng + "消息"
    });
    console.log(this.data);
  },
  onShow: function () { 
    console.log(this.data);
    // this.setData({
    //   name: this.data.editData_h.tongcheng,
    //   text: this.data.editData_h.tongcheng
    // });
  },
  /**
   * 跳转页面
   */
  onNavigateTap: function (e) {
    const dataset = e.currentTarget.dataset, url = dataset.url, name = dataset.name;
    if ("wechat_info_sync" == name) {
      this.onSyncWechatInfo();
    }
    if ("wechat_address" == name) {
      wx.chooseAddress({});
    }
    if ("wechat_setting" == name) {
      wx.openSetting({});
    }
    if ("wechat_clear" == name) {
      wx.showToast({title: '正在清理中...', icon: 'loading', duration: 10});
      wx.clearStorageSync();
      wx.showToast({title: '清理完成', icon: 'success', duration: 1500});
    } else {
      console.log(url);
      wx.navigateTo({url: url});
    }
  },
  /**
   * 展开或收缩
   */
  onToggleTap: function (e) {
    const dataset = e.currentTarget.dataset, name = dataset.name;
    for (var index in this.data.menus) {
      if (name == this.data.menus[index]['name']) {
        var index2 = index;
        break;
      }//index为遍历的索引


    }
    const item = this.data.menus[index2];

    if (!item) return;
    item.isshow = !item.isshow;
    this.setData({menus: this.data.menus});
  },
  // 签到
  mark: function () {
    let t = this;
    let api = tcApi.setMark;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      method: 'POST',
      success: function (resp) {
        let r = resp.data, rd = r.data;
        wx.showModal({
          title: rd.title,
          showCancel: 0,
          content: rd.content
        });
        let user = t.data.user;
        user.is_mark = true;
        t.setData({user: user});
      }
    });
  }
}, templateMethods, tc_common));