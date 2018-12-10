var $ = require("utils/util.js"),
  api = require("api/indexAPI.js");

const tempPage = Page;
const myPage = function (obj) {
  // 识别机型调整菜单高度
  try {
    let info = wx.getSystemInfoSync();
    // console.log(info.model)
    let infoModel_phone = info.model.substring(0, 8);
    if (infoModel_phone == 'iPhone X') {
      obj.data.xcx_menu_height = '68rpx';
    } else {
      obj.data.xcx_menu_height = '0rpx';
    }
  } catch (e) {
    console.log('错误：', e);
  }
  return tempPage(obj);
};
Page = myPage;

/**
 * 自动调用GetUserInfo
 * 自动添加wid和openid参数
 * 装饰Success回调
 * @param obj wx.request的参数
 */
wx.myRequest = function (obj) {
  let cf = require("config.js");
  let userInfo = getApp().globalData.UserInfo;
  // 修改success方法的实现
  let tmpSuccess = obj.success;
  obj.success = function (resp) {
    console.log([
      'myRequest请求信息',
      obj.url,
      obj.method,
      obj.data,
      resp,
    ]);
    tmpSuccess(resp);
  };
  // 自动调用GetUserInfo
  if (!userInfo || !userInfo.WeiXinOpenId) {
    getApp().GetUserInfo(function () {
      let openid = getApp().globalData.UserInfo.WeiXinOpenId;
      obj.data.wid = cf.config.wid;
      obj.data.openid = openid;
      wx.request(obj);
    });
  } else {
    let openid = getApp().globalData.UserInfo.WeiXinOpenId;
    obj.data.wid = cf.config.wid;
    obj.data.openid = openid;
    wx.request(obj);
  }
};
App({
  onLaunch: function () {
  },
  onHide() {
    wx.removeStorageSync('tmp_current_menu_idx');
    wx.removeStorageSync('tmp_current_menu_url');
  },
  GetUserInfo: function (e, t, n) {
    var that = this;
    wx.login({
      success: function (i) {
        wx.getUserInfo({
          success: function (s) {
            console.log('success');
            var o = s.userInfo;
            var u = {
              NickName: o.nickName,
              sex: o.gender,
              photo: o.avatarUrl,
              WXCountry: o.country,
              WXCity: o.city,
              code: i.code,
              WXProvince: o.province,
              Uid: t || 0,
              storeId: n || 0
            };
            console.log(u);
            $.xsr(
              $.makeUrl(api.AddNewUserAndGetShopInfo, u),
              function (res) {
                console.log('AddNewUserAndGetShopInfo接口数据', res);
                if(res.dataList.ShopInfo.is_out){
                  wx.showModal({
                    title: '提示',
                    content: '该小程序已到期，无法访问！',
                    success: function() {
                      wx.navigateBack({
                        delta: -2
                      })
                    }
                  })
                }
                that.globalData.VendorInfo = res.dataList.ShopInfo;
                that.globalData.UserInfo = res.dataList.UserInfo;
                that.globalData.AdInfo = res.dataList.AdInfo;
                e && e();
              }
            );
          },
          fail() {
            // 获取UserInfo失败
            console.log('fail');
            // 授权判断
            // if(getCurrentPages()[0].route!="pages/index/index"){
            console.log('获取权限');
            // 跳转到一个授权中心，进行权限的获取
            wx.navigateTo({url: '../authcenter/authcenter'});
            return false;
            // }
            var u = {
              code: i.code,
              Uid: t || 0,
              storeId: n || 0
            };
            console.log(u);
            $.xsr(
              $.makeUrl(api.AddNewUserAndGetShopInfo, u),
              function (res) {
                console.log('AddNewUserAndGetShopInfo接口数据', res);
                if(res.dataList.ShopInfo.is_out){
                  wx.showModal({
                    title: '提示',
                    content: '该小程序已到期，无法访问！',
                    success: function() {
                      wx.navigateBack({
                        delta: -2
                      })
                    }
                  })
                }
                that.globalData.VendorInfo = res.dataList.ShopInfo;
                that.globalData.UserInfo = res.dataList.UserInfo;
                that.globalData.AdInfo = res.dataList.AdInfo;
                e && e();
              }
            );
          }
      });
      }
    });
  },
  globalData: {
    UserInfo: null,
    VendorInfo: null,
    AdInfo: null,
    loadMusic:true,
    editData_h: {},
    lookup: function (arr, value) {
      for (var i = 0, vlen = arr.length; i < vlen; i++) {
        if (arr[i].name == value) return i;
      }
    },
    setTop: function (data) {
      var num = this.lookup(data, 'navigation_01');

      wx.setStorageSync('navigation', data[num]);
      console.log(data);
    },
    getTop: function (that = null) {
      var a = wx.getStorageSync('navigation');
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: a.selectedColor || '#000'
      });
      that && that.setData({__wechat_main_color: a.selectedColor});
    }
  }
});