const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, {
  data: {
    url_logo: null,
    url_bg: null,
  },
  onLoad() {
    let t = this;
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
    // 加载商家设置
    let settingObj = sellerAPI.sellerSetting;
    settingObj.success = function (resp) {
      let data = resp.data;
      console.log(data);
      let settingData = data.data;
      console.log(settingData);
      if (data.status == 'success') {
        t.setData({
          setting: settingData,
          url_logo: settingData.logo,
          url_bg: settingData.bgpic,
          lat: settingData.lat,
          lng: settingData.lng,
        });
      } else {
        wx.showModal({
          title: '加载失败',
          content: data.msg,
          showCancel: 0
        });
      }
    };
    wx.request(settingObj);
  },
  onShow() {
  },
  chooseImg(e) {
    let t = this;
    let name = e.currentTarget.dataset.name;
    console.log(name);
    // 选择图片文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length == 0) {
          return false;
        }
        let file = tempFilePaths[0];
        var size = res.tempFiles[0].size / 1024;
        if (size > 2048) {
          wx.showModal({
            title: '错误',
            content: '上传图片不能大于2M',
            showCancel: 0
          });
          return false;
        }
        wx.showLoading({
          title: '正在上传',
          mask: true,
        });
        // 上传
        wx.uploadFile({
          url: sellerAPI.uploadImg.url, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          success: function (res) {
            var imgPath = res.data;
            console.log(imgPath);
            let setDt = {};
            setDt[name] = imgPath;
            t.setData(setDt);
          },
          complete() {
            wx.hideLoading();
          }
        });
      }
    });
  },
  chooseLocation(e) {
    let t = this;
    wx.chooseLocation({
      success(locInfo) {
        console.log(locInfo);
        t.setData({
          lat: locInfo.latitude,
          lng: locInfo.longitude
        });
      },
      fail(failInfo) {
        console.log('fail', failInfo);
        wx.openSetting();
      }
    });
  },
  formSubmit(e) {
    let t = this;
    let tData = this.data;
    let formData = e.detail.value;
    console.log(formData);
    formData.lat = tData.lat;
    formData.lng = tData.lng;
    formData.logo = tData.url_logo;
    formData.bgpic = tData.url_bg;
    formData.save = true;
    wx.request({
      url: sellerAPI.sellerSetting.url,
      method: 'POST',
      data: Object.assign({}, sellerAPI.sellerSetting.data, formData),
      success(resp) {
        let data = resp.data;
        console.log(data);
        if (data.status == 'success') {
          wx.showModal({
            title: '成功',
            content: data.msg,
            showCancel: false
          });
        }
      }
    });
  }
}, templateMethods));