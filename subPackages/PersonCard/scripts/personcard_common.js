let app        = getApp();
// let myTools    = require('../../../utils/myTools');
let apiList    = require('./apiList');
let WxParse         = require("../../../wxParse/wxParse.js");

module.exports = {
  //获取店铺基本信息
  getCardInfo(openid) {
    let t   = this;
    let api = apiList.getCardInfo;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid,
        openid: openid,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', r);
        if(r.status == 'error'){
          t.setData({
            flag:0
          })
        }else{
          t.setData({
            flag:1,
            cardInfo:rd
          })
        }
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  getUser(openid){
    let t   = this;
    let api = apiList.getUser;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid,
        openid: openid,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', resp);
        t.setData({
          cardInfo:rd
        })
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  }
};