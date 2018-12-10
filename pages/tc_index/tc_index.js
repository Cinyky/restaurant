var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi'),
  $ = require("../../utils/util.js"),
  api = require("../../api/indexAPI.js");
Page(Object.assign({}, {
  data: {
    msgList: [],
    type: 0,
    lat: null,
    lng: null,
  },

  onLoad: function (option) {
    let t = this, ts = t.data;
    this.setMenu(this);
    app.globalData.getTop(t);
    this.setData({
      editData_h: app.globalData.editData_h
    });
    wx.setNavigationBarTitle({ 
      title: this.data.editData_h.tongcheng + "信息"
    });
  },
  onShow(){
    console.log(this.data)
    let t = this, ts = t.data;
    app.GetUserInfo(function  () {
      console.log('1');
      t.reloadPage();
      console.log('2');
    })
  },
  reloadPage() {
    let t = this, ts = t.data;
    // 加载设置
    t.loadSetting(true);
    // 加载分类列表
    t.loadCateList(true);
    // 加载轮播图
    t.loadImgList();
    // 加载公告
    t.loadNoticeList();
    // 加载最新发||距离最近
    if (t.data.type == 0) {
      t.loadNewest(true);
    } else {
      t.loadNearest(true);
    }
  },
  loadImgList() {
    let t = this;
    let api = tcApi.getImgList;
    wx.showLoading({ title: 'Loading', mask: 1 });
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.setData({ imgList: rd });
        } else {
          wx.showModal({ title: '提示', content: r.msg });
        }
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  loadNoticeList() {
    let t = this;
    let api = tcApi.getNoticeList;
    wx.showLoading({ title: 'Loading', mask: 1 });
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.setData({ noticeList: rd });
        } else {
          wx.showModal({ title: '提示', content: r.msg });
        }
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 加载最新的消息
  loadNewest(reload = false) {
    let t = this, ts = t.data;
    if (!reload && !t.data.hasMore) return false;
    // 清空当前的数据
    if (reload) {
      t.setData({
        msgList: [],
        hasMore: true,
        page: 0
      });
    }
    let api = tcApi.getMsgByTime;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        page: t.data.page,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          let _msgList = t.data.msgList;
          _msgList.push(...rd);
          t.setData({ msgList: _msgList, page: t.data.page + 1 });
          if (rd.length == 0) {
            t.setData({ hasMore: false });
          }
        } else {
          wx.showToast({ title: r.msg, mask: 1 });
        }
      }
    });

  },
  // 加载距离最近的消息
  loadNearest(reload = false) {
    let t = this, ts = t.data;
    if (!reload && !t.data.hasMore) return false;
    // 清空当前的数据
    if (reload) {
      t.setData({
        msgList: [],
        hasMore: true,
        page: 0
      });
    }
    let api = tcApi.getMsgByDistance;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        page: t.data.page,
        lat: t.data.lat,
        lng: t.data.lng
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        if (r.status == 'success') {
          let _msgList = t.data.msgList;
          _msgList.push(...rd);
          t.setData({ msgList: _msgList, page: t.data.page + 1 });
          if (rd.length == 0) {
            t.setData({ hasMore: false });
          }
        } else {
          wx.showToast({ title: r.msg, mask: 1 });
        }
      }
    });
  },
  onAdTap: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/webView/webView?url=' + url
    });
  },
  onSwitchTabTap(e) {
    let t = this, ds = e.currentTarget.dataset;
    let type = ds.type;
    if (type != t.data.type) {
      // 重新加载消息
      if (type == 0) {
        // 最新发
        t.setData({ type: type });
        t.loadNewest(true);
      } else {
        // 距离最近
        // 先获取当前的位置信息
        wx.getLocation({
          success(res) {
            console.log(res);
            t.setData({ type: type, lat: res.latitude, lng: res.longitude });
            // 加载消息
            t.loadNearest(true);
          },
          fail() {
            wx.showModal({
              title: '错误',
              content: '请允许位置信息权限',
              success(r) {
                if (r.confirm) {
                  wx.openSetting();
                }
              }
            });
          }
        });
      }
    }
  },
  onReachBottom: function () {
    let t = this;
    if (t.data.type == 0) {
      console.log('加载最新');
      t.loadNewest();
    } else {
      console.log('加载最近');
      t.loadNearest();
    }
  },
  bindNavToList(e) {
    let t = this, ds = e.currentTarget.dataset;
    console.log(e);
    wx.navigateTo({ url: `/pages/tc_lists/tc_lists?type=${ds.type}&cate_id=${ds.id}` });
  },
  bindSearch(e) {
    console.log(e);
  },
  onSearchSubmit(e) {
    let t = this, word = e.detail.value.keyword;
    wx.navigateTo({ url: `/pages/tc_lists/tc_lists?type=search&word=${word}` });
  },
  /**
   * 显示搜索框
   */
  onShowSearchTap: function () {
    this.setData({ searchShow: true });
  },
  /**
   * 隐藏搜索框
   */
  onHideSearchBlur: function (e) {
    this.setData({ searchShow: false });
  },
  onPullDownRefresh() {
    this.reloadPage();
  },
  onShareAppMessage: function () {

  },
  imgHeight123: function (e) {
    console.log(e);
    // if (this.data.testcc) {
    //   this.setData({
    //     testcc: false
    //   })
    //   console.log(e);
      var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
      var imgh = e.detail.height;//图片高度
      var imgw = e.detail.width;//图片宽度
      var swiperH = winWid * imgh / imgw + "px"//等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      this.setData({
        swiperHeight: swiperH//设置高度
      })
      console.log(this.data);
    // }
  }
}, templateMethods, tc_common));
