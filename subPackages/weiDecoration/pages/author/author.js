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
    demoList: [],
    hasMore: true,
    page: 0,
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
      t.getAuthor(t.data.options.id, function (author) {
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
    let api = wdApi.getDemo;
    wx.myRequest({
      url: api.url,
      data: {
        author_id: t.data.author.id,
        page: t.data.page
      },
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
  onReachBottom() {
    this.loadData();
  },
  gotoDesign(){
    let t=this;
    let url=`../design/design?author_id=${t.data.author.id}`;
    console.log(url);
    wx.navigateTo({url:url});
  }
}, templateMethods, common));
