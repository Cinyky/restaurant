let app = getApp();
let myTools = require('../utils/myTools');
let cpAPI = require('../api/cpAPI');
module.exports = {
  // 显示导航
  navShow: function (e) {
    this.setData({
      navshow: true,
    });
  },
  // 隐藏导航
  navHide: function (e) {
    this.setData({
      navshow: false,
    });
  },
  // 导航跳转
  linkto: function (e) {
    this.navHide();
    let key = e.currentTarget.dataset.key;
    console.log(key);
    if (key == "index") {
      wx.redirectTo({
        url: '../index/index'
      });
    }
    if (key == "about") {
      wx.navigateTo({
        url: '../about/about'
      });
    }
    if (key == "news") {
      wx.navigateTo({
        url: '../news/news'
      });
    }
    if (key == "prod") {
      wx.navigateTo({
        url: '../prod/prod'
      });
    }
    if (key == "demo") {
      wx.navigateTo({
        url: '../demo/demo'
      });
    }
    if (key == "contact") {
      wx.navigateTo({
        url: '../contact/contact'
      });
    }
    if (key == "joinus") {
      wx.navigateTo({
        url: '../joinus/joinus'
      });
    }
  },
  // 拨打电话
  cllmobile: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile //仅为示例，并非真实的电话号码
    });
  },
  // 跳转到详情
  detail: function (event) {
    let key = event.currentTarget.dataset.key;
    let id = event.currentTarget.dataset.id;
    console.log(key, id);
    if (key == "about") {
      wx.navigateTo({
        url: '../about/about'
      });
    }
    if (key == "news") {
      wx.navigateTo({
        url: '../newsDetail/newsDetail?id=' + id
      });
    }
    if (key == "prod") {
      wx.navigateTo({
        url: '../prodDetail/prodDetail?id=' + id
      });
    }
    if (key == "demo") {
      wx.navigateTo({
        url: '../demoDetail/demoDetail?id=' + id
      });
    }
    if (key == "contact") {
      wx.navigateTo({
        url: '../contact/contact'
      });
    }
    if (key == "joinus") {
      wx.navigateTo({
        url: '../joinusDetail/joinusDetail?id=' + id
      });
    }
  },
  getSetting(withContent = 0, callback = null) {
    let t = this;
    let api = cpAPI.getSetting;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        withContent: withContent
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({setting: rd});
        callback && callback(rd);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  // 获取轮播图列表
  getImgList(callback = null) {
    let t = this;
    let api = cpAPI.getImgList;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({imgList: rd});
        callback && callback(rd);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  // 获取菜单列表
  getMenuList(type, callback = null) {
    let t = this;
    let api = cpAPI.getMenuList;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        type: type,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({menu: rd});
        callback && callback(rd);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  // 获取轮播图列表
  getContentList(type, mid, page, callback = null) {
    let t = this;
    let api = cpAPI.getContentList;
    myTools.showLoading();
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        type: type,
        mid: mid,
        page: page,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        if (rd.length == 0) {
          t.setData({hasMore: false});
        } else {
          let newList = [...t.data.list, ...rd];
          t.setData({list: newList, page: t.data.page + 1});
          callback && callback(rd, newList);
        }
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      },
      complete() {
        myTools.hideLoading();
      }
    });
  },
  // 重置当前列表状态
  resetContentList(mid = 0, cb) {
    this.setData({
      page: 0,
      hasMore: true,
      list: [],
      mid: mid,
    });
    cb && cb(mid);
  },
  changeMenu(e) {
    let t = this, id = e.currentTarget.dataset.id;
    t.setData({mid: id}, function () {
      t.resetContentList(id, function (mid) {
        // 调用页面中的加载函数
        t.loadContentList();
      });
    });
  },
  loadContentList(cb) {
    let t = this;
    if (!t.data.hasMore) {
      return false;
    } else {
      // 加载
      t.getContentList(t.data.type, t.data.mid, t.data.page, function (ls, allLs) {
        cb && cb(ls, allLs);
      });
    }
  },
  getContent(type, id, callback = null) {
    let t = this;
    let api = cpAPI.getContent;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        type: type,
        id: id
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({content: rd});
        callback && callback(rd);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
};