let app = getApp();
let myTools = require('../../../utils/myTools');
let wdApi = require("apiList");
module.exports = {
  // 切换分类菜单的显示状态
  toggleSelectBtn: function (e) {
    let t = this;
    let key = e.currentTarget.dataset.key;
    let menuShow = t.data.menuShow;
    for (let k in menuShow) {
      if (k !== key && menuShow.hasOwnProperty(k)) {
        menuShow[k] = false;
      }
    }
    menuShow[key] = !menuShow[key];
    t.setData({
      menuShow: menuShow,
    });
  },
  // 获取设置
  getSetting(cb = false) {
    let t = this, api = wdApi.getSetting;
    wx.myRequest({
      url: api.url,
      data: {},
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        t.setData({setting: rd});
        cb && cb(rd);
      }
    });
  },
  // 获取分类
  getCate(all = true, cb = false) {
    let t = this, api = wdApi.getCate;
    wx.myRequest({
      url: api.url,
      data: {},
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        if (all) {
          for (let k in rd) {
            if (rd.hasOwnProperty(k)) {
              rd[k] = rd[k] ? rd[k] : [];
              rd[k].unshift({
                id: 0,
                name: '不限'
              });
            }
          }
        }
        t.setData({cate: rd});
        cb && cb(rd);
      }
    });
  },
  // 获取设计师列表
  getAuthorList(cb = false) {
    let t = this, api = wdApi.getAuthorList;
    wx.myRequest({
      url: api.url,
      data: {},
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        t.setData({authorList: rd});
        cb && cb(rd);
      }
    });
  },
  // 拨打手机号
  callPhone(e) {
    let t = this, ds = e.currentTarget.dataset, phone = ds.phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      });
    }
  },
  // 跳转到设计师首页
  gotoAuthorIndex(e) {
    let t = this, ds = e.currentTarget.dataset, authorId = ds.authorId;
    if (authorId) {
      // 跳转到设计师详情页面
      let url = `../author/author?id=${authorId}`;
      console.log(url);
      wx.navigateTo({url: url});
    }
  },
  getAuthor(authorId, cb = null) {
    let t = this, api = wdApi.getAuthor;
    wx.myRequest({
      url: api.url,
      data: {
        id: authorId
      },
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        t.setData({author: rd});
        cb && cb(rd);
      }
    });
  }
};