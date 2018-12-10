let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let api = require('../../scripts/apiList');
let common = require('../../scripts/common');
let apiList = require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    config: require('../../scripts/config'),
    type: 0
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 加载数据
  onShow: function () {
    let t = this;
    t.getSetting(function (setting) {
      t.loadData();
    });
  },
  changeTab(e) {
    let t = this, ds = e.currentTarget.dataset, type = ds.type;
    t.setData({type: type});
    // 加载数据
    t.loadData();
  },
  loadData() {
    let t = this;
    let api = apiList.getLove;
    wx.myRequest({
      url: api.url,
      method: api.method,
      data: {
        type: t.data.type
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        t.setData({
          demoList: rd
        });
      }
    });
  },
  toggleLove(e) {
    let t = this, ds = e.currentTarget.dataset, tid = ds.tid, type = ds.type, idx = ds.idx;
    let api = apiList.markLove;
    wx.myRequest({
      url: api.url,
      data: {
        tid: tid,
        type: type
      },
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        let demo = t.data.demoList[idx];
        if (demo.is_love) {
          demo.is_love = false;
          demo.love_num--;
        } else {
          demo.is_love = true;
          demo.love_num++;
        }
        t.data.demoList[idx] = demo;
        t.setData({demoList: t.data.demoList});
      }
    });
  },
  showImgs(e) {
    let t = this, ds = e.currentTarget.dataset, idx = ds.idx;
    console.log(idx);
    let item = t.data.demoList[idx];
    console.log(item.imgs);
    wx.previewImage({
      urls: item.imgs // 需要预览的图片http链接列表
    });
  },
}, templateMethods, common));
