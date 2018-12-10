var app             = getApp();
let moreshop_common = require('../../utils/moreshop_common');
let templateMethods = require("../../utils/template_methods.js");
let moreshopApi     = require('../../api/moreshopApi');
Page(Object.assign({}, {
  data      : {
    currentTab: 1,
    lat       : null,
    lng       : null
  },
  onLoad    : function (option) {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    t.initLocation();
  },
  initLocation() {
    let t = this;
    wx.getLocation({
      success(e) {
        t.setData({
          lat: e.latitude,
          lng: e.longitude
        });
        t.shop_list(t.data.currentTab, t.data.lat, t.data.lng);
      }, fail() {
        wx.showModal({
          title  : '提示',
          content: '请允许位置信息权限，否则无法正常提供服务',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success() {
                  t.initLocation();
                }
              })
            }
          }
        })
      }
    })
  },
  //选择位置
  position  : function () {
    let t = this;
    wx.chooseLocation({
      success: function (res) {
        var latitude  = res.latitude;
        var longitude = res.longitude;
        var address   = res.address;
        // console.log(address);
        t.setData({
          lat: latitude,
          lng: longitude,
          address  : address
        });
        //获取商家列表
        t.shop_list(t.data.currentTab, latitude, longitude);
      }
    });
  },
  //搜索
  bindSearch: function (e) {
    let t = this;
    console.log(e.detail.value);
    t.shop_list(t.data.currentTab, t.data.lat, t.data.lng, e.detail.value);
  },
  //切换标签
  bindChangeTab(e) {
    let t = this, type = e.currentTarget.dataset.type;
    t.setData({
      currentTab: type
    });
    this.shop_list(type, this.data.lat, this.data.lng);
  },
  
  //加入按钮
  bind_livein: function () {
    let t   = this;
    let api = moreshopApi.is_apply;
    app.GetUserInfo(function(){
      console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
      // t.setData({
      //   openid:app.globalData.UserInfo.WeiXinOpenId
      // });
      wx.request({
        url    : api.url,
        data   : {
          wid   : api.data.wid,
          openid: app.globalData.UserInfo.WeiXinOpenId
        },
        method : 'POST',
        success: function (e) {
          console.log('判断是否已申请：', e);
          if (e.data.type == '2') {//审核失败，重新申请
            wx.showModal({
              title  : '提示',
              content: e.data.msg,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  wx.navigateTo({
                    url: '/pages/moreshop_sellerin/moreshop_sellerin'
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          } else if (e.data.status == 'success') {//审核成功，去支付
            wx.showModal({
              title  : '成功',
              content: e.data.msg,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  //付款
                  t.paySellerIn(app.globalData.UserInfo.WeiXinOpenId);
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          } else if (e.data.status == 'error') {
            wx.showModal({//正在审核中
              title     : '等待',
              content   : e.data.msg,
              showCancel: 0
            });
          } else {
            console.log(e.data.msg);
            wx.navigateTo({
              url: '/pages/moreshop_sellerin/moreshop_sellerin'
            });
          }
        }
      });
    });
  },
  //跳转至商店页面
  bindInShop: function (e) {
    //获取商店id
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url:'/pages/moreshop_shopdetail/moreshop_shopdetail?id='+id
    })
  }
}, templateMethods, moreshop_common));