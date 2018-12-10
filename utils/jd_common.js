let app = getApp();
let myTools = require('../utils/myTools');
let jdApi = require('../api/jdAPI');
module.exports = {
  // 获取酒店设置
  getSetting(callback = null) {
    let t = this;
    let api = jdApi.getSetting;
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
          wx.showModal({ title: '错误', content: r.msg || '未知错误' });
          return false;
        }
        t.setData({ setting: rd });
        callback && callback();
      },
      fail() {
        wx.showModal({ title: '错误', content: '网络错误' });
      }
    });
  },
  // 获取酒店列表
  getJdList(lat, lng, callback = null) {
    let t = this;
    let api = jdApi.getJdList;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        lat: lat,
        lng: lng
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({ title: '错误', content: r.msg || '未知错误' });
          return false;
        }
        t.setData({ jdList: rd });
        callback && callback();
      },
      fail() {
        wx.showModal({ title: '错误', content: '网络错误' });
      }
    });
  },
  // 获取酒店详情
  getJd(id, callback = null) {
    let t = this;
    let api = jdApi.getJd;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        id: id
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({ title: '错误', content: r.msg || '未知错误' });
          return false;
        }
        t.setData({ jd: rd });
        callback && callback(rd);
      },
      fail() {
        wx.showModal({ title: '错误', content: '网络错误' });
      }
    });
  },
  // 获取单个订单
  getOrder(id,callback=null){
    let t = this;
    let api = jdApi.getOrder;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        id: id
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({ title: '错误', content: r.msg || '未知错误' });
          return false;
        }
        t.setData({ order: rd });
        callback && callback(rd);
      },
      fail() {
        wx.showModal({ title: '错误', content: '网络错误' });
      }
    });
  }
};