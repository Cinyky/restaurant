var app = getApp();
module.exports = {
  setMenu(that) {
    // 设置菜单高亮
    try {
      let menuInfo = wx.getStorageSync('navigation');
      let hlIdx = that.highlightMenu();
      console.log('高亮', hlIdx);
      let dt = {};
      dt.highLightIndex = hlIdx;
      if (menuInfo) {
        dt.menuInfo = menuInfo;
      }
      that.setData(dt);
    }catch (e) {
      console.log('错误：',e);
    }
  },
  highlightMenu() {
    let tmp_idx = wx.getStorageSync('tmp_current_menu_idx');
    if (!tmp_idx) return 0;
    return tmp_idx;
    let tmp_url = wx.getStorageSync('tmp_current_menu_url');
    if (!tmp_url) return 0;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let currPageRoute = currPage.route;
    console.log('当前页面路由为', currPageRoute);
    let menuInfo = wx.getStorageSync('navigation');
    let hlIdx = null;
    for (let i = 0; i < menuInfo.dataList.length; i++) {
      let val = menuInfo.dataList[i];
      if (val.linkurl == tmp_url) {
        return i;
      }
    }
    return null;
  },
  phone(e) {
    var phone = e.currentTarget.dataset.phone;
    if (!phone) {
      phone = app.globalData.VendorInfo.LegalNumber;
    }
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: function () {
        wx.showToast({
          title: '拨打失败',
          image: '../../assets/fail.png',
          duration: 2000
        });
      }
    });
  },
  map(e) {
    var lat = e.currentTarget.dataset.lat;
    var lng = e.currentTarget.dataset.lng;
    var address = e.currentTarget.dataset.address;
    var name = e.currentTarget.dataset.name;
    console.log(app.globalData.VendorInfo);
    if (!lat) {
      lat = app.globalData.VendorInfo.WapLat;
      lng = app.globalData.VendorInfo.WapLng;
      address = app.globalData.VendorInfo.LegalAdress;
      name = app.globalData.VendorInfo.ShopName;
    }
    wx.openLocation({
      latitude: lat - 0, // 纬度，范围为-90~90，负数表示南纬
      longitude: lng - 0, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
      name: name || '暂未填写',
      address: address || '暂未填写',
      fail: function () {
        wx.showToast({
          title: '地图打开失败',
          image: '../../assets/fail.png',
          duration: 2000
        });
      }
    });
  },
  program: function (e) {
    var data = e.currentTarget.dataset.data;
    data = data.split(",");
    wx.navigateToMiniProgram({
      appId: data[0],
      path: data[1],
      envVersion: 'release',
      complete() {
        console.log(data[1]);
      }
    });
  },
  web: function (e) {
    var webUrl = e.currentTarget.dataset.data;
    wx.navigateTo({
      url: '/pages/webView/webView?url=' + webUrl
    });
  },
  bind_menu_redirect_btn(e) {
    let url = e.currentTarget.dataset.url;
    let idx = e.currentTarget.dataset.idx;
    wx.setStorageSync('tmp_current_menu_url', url);
    wx.setStorageSync('tmp_current_menu_idx', idx);
    wx.redirectTo({url: url});
  }
};