let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let common = require('../../scripts/common');
let wdApi = require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    config: require('../../scripts/config'),
    authorList: [],
    options: {},
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    if (!options.id) {
      wx.showModal({title: '错误', content: "参数错误"});
      return false;
    }
    t.setData({options: options});
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.getSetting(function (setting) {
      let api = wdApi.getDemo;
      wx.myRequest({
        url: api.url,
        data: {
          id: t.data.options.id,
        },
        method: api.method,
        success(resp) {
          let r = resp.data, rd = r.data[0];
          if (!rd) {
            wx.showModal({title: '错误', content: '未获取到详细信息'});
            return false;
          }
          console.log(rd);
          t.setData({
            demo: rd,
          });
        }
      });
    });
  },
  toggleLove(e) {
    let t = this, ds = e.currentTarget.dataset, tid = ds.tid, type = ds.type;
    let api = wdApi.markLove;
    wx.myRequest({
      url: api.url,
      data: {
        tid: tid,
        type: type
      },
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        let demo = t.data.demo;
        if (demo.is_love) {
          demo.is_love = false;
          demo.love_num--;
        } else {
          demo.is_love = true;
          demo.love_num++;
        }
        t.setData({demo: demo});
      }
    });
  }
}, templateMethods, common));
