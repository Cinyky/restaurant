let app        = getApp();
let myTools    = require('../../../utils/myTools');
let apiList    = require("apiList");
let WxParse         = require("../../../wxParse/wxParse.js");
module.exports = {
  //获取个人信息
  addUserInfo:function(){
    let t = this;
    app.GetUserInfo(function(){
      console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
      // t.setData({
      //   openid:app.globalData.UserInfo.WeiXinOpenId
      // });
      let openid = app.globalData.UserInfo.WeiXinOpenId;
      let api = apiList.addUserInfo;
      wx.request({
        url:api.url,
        method:api.method,
        data:{
          openid  : openid,
          wid:api.data.wid
        },
        success(resp){
          console.log('此次的信息：',resp.data.data);
          t.setData({
            userInfo:resp.data.data
          })
        }
      })
    });
  },
  //获取首页配置
  getSetting : function () {
    let t   = this;
    let api = apiList.getSetting;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          jumpSwiperUrls: rd
        });
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取门店信息
  getShopInfo: function () {
    let t   = this;
    let api = apiList.getShopInfo;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          list: rd
        });
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取门店具体信息
  getShopDetail: function (id) {
    let t   = this;
    let api = apiList.getShopDetail;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid,
        shopid:id
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          info: rd
        });
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取经纪人列表
  getAgentList: function () {
    let t   = this;
    let api = apiList.getAgentList;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid,
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          agentList: rd
        });
        //解析富文本
        // WxParse.wxParse("info", "html", t.data.agentList.intro, t);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取经纪人信息
  getAgentInfo:function (id) {
    let t   = this;
    let api = apiList.getAgentInfo;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid,
        agentid:id
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          agentInfo: rd
        });
        //解析富文本
        WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取门店对应经纪人列表
  getShopAgent: function (id) {
    let t   = this;
    let api = apiList.getShopAgent;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid    : api.data.wid,
        shopid: id
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          shopAgentList: rd.agent,
          shopFangList:rd.fang
        });
        //解析富文本
        // WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  getXiaoQu:function (id) {
    let t   = this;
    let api = apiList.getXiaoQu;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid    : api.data.wid,
        parentid: id
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('小区列表：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          xiaoquList: rd
        });
        //解析富文本
        // WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取租房和售房信息
  getFang: function (id=null) {
    let t   = this;
    //获取当前用户信息
    app.GetUserInfo(function(){
      console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
      // t.setData({
      //   otheropenid:app.globalData.UserInfo.WeiXinOpenId
      // });
      let api = apiList.getFang;
      wx.request({
        url   : api.url,
        method: api.method,
        data  : {
          wid     : api.data.wid,
          fangid:id,
          otheropenid:app.globalData.UserInfo.WeiXinOpenId
          // openid: app.globalData.UserInfo.WeiXinOpenId,
        },
        success(resp) {
          let r = resp.data, rd = r.data;
          console.log('返回的房源：', rd);
          if (r.status != 'success') {
            wx.showModal({title: '错误', content: r.msg || '未知错误'});
            return false;
          }
          t.setData({
            zushouList: rd
          });
          if(id){
            //获取标记
            var i = {
              iconPath: "../../../images/village.png",
              id: 0,
              latitude: rd.xiaoqu.lat,
              longitude: rd.xiaoqu.lng,
              width: 24,
              height: 24,
              title: '坐标'
            }, a = [];
            a.push(i);
            t.setData({
              marker: a,
              collect:rd.collect
            });
          }
          //解析富文本
          // WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
        },
        fail() {
          wx.showModal({title: '错误', content: '网络错误'});
        }
      });
    });
  },
  getAgentFang: function (agentid) {
    let t   = this;
    let api = apiList.getAgentFang;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid    : api.data.wid,
        agentid: agentid
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('获取到经纪人的房源：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          AgentFangList: rd
        });
        //解析富文本
        // WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取搜索的发列表
  getSearchList: function (search,type) {
    let t   = this;
    let api = apiList.getSearchList;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid    : api.data.wid,
        search: search,
        type:type
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('获取到搜索的房源：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({
          SearchList: rd
        });
        //解析富文本
        // WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
};