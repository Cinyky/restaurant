var app = getApp();
let zhctApi = require('../../api/zhctAPI');
var templateMethods = require("../../utils/template_methods.js"),
  $ = require("../../utils/util.js"),
  indexAPI = require("../../api/indexAPI.js");
var qiyeapi = require("../../api/supercard.js");
Page(Object.assign({}, {
  data: {
    loaded: false,
    setting: {},
    show_color_setting: false,
    show_select_table: false,
  },
  onLoad: function () {
    this.setData({
      editData_h: app.globalData.editData_h
    });
  },
  onShow: function () {
    console.log(this.data);
    var t = this;
    this.setMenu(this);
    console.log(indexAPI.GetIndexData)
    app.GetUserInfo(function () {
      var vdata = {};
      $.xsr($.makeUrl(indexAPI.GetIndexData, vdata),
      function (res) {
        app.globalData.getTop(t);
        // 获取配色设置
        // let main_color = wx.getStorageSync('zhct_main_color');
        // if (!main_color) {
        //   wx.setStorageSync('main_color', '#fe5848');
        //   main_color = '#fe5848';
        // }
        // t.setData({
        //   main_color: main_color
        // });
      })
    })
    // 加载商户信息,完成之后设loaded为true
    let api = zhctApi.getInfo;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid
      },
      method: 'POST',
      success(resp) {
        let rData = resp.data;
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: 0
          });
        } else {
          t.setData({
            setting: rData.data,
            loaded: true
          });
          wx.setNavigationBarTitle({
            title: rData.data.name || '智慧餐饮'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          mask: 1,
        });
      }
    });
    //发送企业微信提示
    console.log('发送企业微信提示');
    t.sendQiYeMessage();
    t.saveEvent(13);
  },



  //发送企业微信通知
  sendQiYeMessage:function(){
    wx.request({
      url: qiyeapi.sendQiYeMessage.url,
      data: Object.assign({}, {
        userInfo: app.globalData.UserInfo,
        type:'zhct',
        content:'智慧餐厅',
      }, qiyeapi.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
        } else {
          console.log('日志发送失败!');
        }
      }
    })
  },

  saveEvent:function(eventId){
    wx.request({
      url: qiyeapi.saveCardEvent.url,
      data: Object.assign({}, {
        open_id: app.globalData.UserInfo.WeiXinOpenId,
        event_id: eventId,
      }, qiyeapi.saveCardEvent.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          console.log(res.data.msg);
        } else {
          console.log(res.data.msg);
        }
      }
    })
  },


  diancan: function (e) {
    let t = this, td = this.data;
    wx.showLoading({title: '加载中'});
    if (td.setting.is_open_sm == 1) {
      wx.showLoading({title: '加载中'});
      // 获取桌台列表
      let api = zhctApi.getTableList;
      wx.request({
        url: api.url,
        method: 'POST',
        data: {
          wid: api.data.wid,
        },
        success(resp) {
          let rData = resp.data;
          if (rData.status == 'success') {
            selectTable(rData.data);
          } else {
            wx.showModal({
              title: '错误',
              content: rData.msg,
              showCancel: 0
            });
          }
        }, fail() {
          wx.showModal({
            title: '错误',
            content: '网络错误',
            showCancel: false
          });
        }, complete() {
          wx.hideLoading()
        }
      });
      // 选择桌台
      let selectTable = function (tableList) {
        t.setData({tableList: tableList, show_select_table: true});
      };
    } else {
      wx.showModal({
        title: '提示',
        content: "对不起，暂不支持店内" + this.data.editData_h.diancan,
        showCancel: false
      });
    }
  },
  hide_select_table() {
    this.setData({
      show_select_table: false,
    })
  },
  bindSelectTable(e) {
    let t = this, id = e.currentTarget.dataset.id;
    t.setData({
      show_select_table: false,
    });
    wx.navigateTo({
      url: `/pages/zhct_main/zhct_main?type=0&tableId=${id}`
    });
  },
  //wm
  waimai: function (e) {
    let t = this, td = this.data;
    if (td.setting.is_open_wm == 1) {
      // 跳转到菜品页面，类型为wm
      wx.navigateTo({
        url: '/pages/zhct_main/zhct_main?type=1'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: "对不起，暂不支持" + this.data.editData_h.waimai,
        showCancel: false
      });
    }
  },
  //导航
  // get_location_bind: function () {
  //   wx.showToast({
  //     title: '地图加载中',
  //     icon: 'loading',
  //     duration: 5000,
  //     mask: true
  //   });
  //   var that = this;
  //   var loc_lat = that.data.r_store.yt_str_coordinate.latitude;
  //   var loc_lng = that.data.r_store.yt_str_coordinate.longitude;
  //   wx.openLocation({
  //     latitude: parseFloat(loc_lat),
  //     longitude: parseFloat(loc_lng),
  //     scale: 18,
  //     name: that.data.r_store.name,
  //     address: that.data.r_store.address
  //   });
  // },
  //电话
  call_phone_bind: function () {
    let t = this, td = t.data;
    wx.makePhoneCall({
      phoneNumber: td.setting.phone
    });
  },
  //图片放大
  // img_max_bind: function (e) {
  //   var that = this;
  //   wx.previewImage({current: e.target.dataset.url, urls: that.data.r_store.sjimg});
  // },
  // img_max_bind_zz: function (e) {
  //   var that = this;
  //   wx.previewImage({current: e.target.dataset.url, urls: that.data.r_store.zzimg});
  // },
  //下拉刷新
  // onPullDownRefresh: function () {
  //   var that = this;
  //
  //   setTimeout(() => {
  //     wx.stopPullDownRefresh();
  //   }, 1000);
  // },
  // onShareAppMessage: function () {
  //   var that = this;
  //   var shareTitle = that.data.r_store.name;
  //   var shareDesc = that.data.r_store.name;
  //   var sharePath = 'pages/restaurant/restaurant-home-info/index?str_id=' + that.data.id;
  //   return {
  //     title: shareTitle,
  //     desc: shareDesc,
  //     path: sharePath
  //   };
  // },
  show_color_setting() {
    this.setData({
      show_color_setting: true,
    })
  },
  hide_color_setting() {
    this.setData({
      show_color_setting: false,
    });
  },
  bind_select_color(e) {
    let color = e.currentTarget.dataset.color;
    wx.setStorageSync('zhct_main_color', color);
    this.setData({
      main_color: color,
      show_color_setting: false,
    });
  }
}, templateMethods));