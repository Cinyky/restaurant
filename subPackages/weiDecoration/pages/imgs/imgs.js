let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let wdApi = require('../../scripts/apiList');
let common = require('../../scripts/common');
let apiList = require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {
    config: require('../../scripts/config'),
    menuShow: {
      kj: false,
      fg: false,
      jb: false,
    },
    filter: {
      kj_id: 0,
      fg_id: 0,
      jb_id: 0,
    },
    page: 0,
    hasMore: true,
    demoList: []
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
      t.getCate(true, function (cate) {
        t.reloadData();
      });
    });
  },
  reloadData() {
    let t = this;
    t.setData({
      hasMore: true,
      page: 0,
      demoList: []
    });
    t.loadData();
  },
  loadData() {
    let t = this;
    if (!t.data.hasMore) {
      return false;
    }
    let api = wdApi.getImgs;
    wx.myRequest({
      url: api.url,
      data: Object.assign({}, t.data.filter, {
        page: t.data.page
      }),
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log(rd);
        t.setData({
          page: t.data.page + 1,
          hasMore: rd.length == 10,
          demoList: [...t.data.demoList, ...rd]
        });
      }
    });
  },
  // 修改过滤器
  changeFilter(e) {
    let t = this, ds = e.currentTarget.dataset, id = ds.id, key = ds.key;
    let filter = t.data.filter;
    filter[`${key}_id`] = id;
    t.setData({
      filter: filter
    });
    t.reloadData();
  },
  onReachBottom() {
    this.loadData();
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
  toggleLove(e) {
    let t = this, ds = e.currentTarget.dataset, tid = ds.tid, type = ds.type, idx = ds.idx;
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
  }
}, templateMethods, common));
