//index.js
//获取应用实例
const app = getApp();
const dzpApi = require('../../api/dzpAPI');
var indexapi1 = require('../../api/zhctAPI');
var decodeDataApi = require('../../api/decodeDataAPI');
Page({
  data: {
    animationData: {
      duration: 3000,
      timingFunction: 'linear',
      rotate: 0
    },
    prize: null,
    start: false,
    is_end: -1,
    showFail: false,
    showWin: false
  },
  onLoad() {
    this.loadInfo();
  },
  loadInfo() {
    let t = this;
    let apiObj = dzpApi.getDzpInfo;
    console.log(apiObj);
    apiObj.data.openid = app.globalData.UserInfo.WeiXinOpenId;
    apiObj.success = function (resp) {
      let respData = resp.data;
      console.log(respData);
      if (respData.status == 'error') {
        wx.showModal({
          title: '错误',
          content: respData.msg,
          showCancel: 0,
        });
        return false;
      }
      let data = respData.data;
      console.log(data);
      t.setData(data);
    };
    wx.request(apiObj);
  },
  onShow() {
  },
  animation: function () {
    let t = this;
    let ani = {
      animationData: {
        duration: 0,
        timingFunction: 'linear',
        rotate: 0,
      },
      start: false,
    };
    let prize = t.data.prize;
    if (prize.is_empty == 1) {
      ani.showFail = true;
    } else {
      ani.showWin = true;
    }
    this.setData(ani);
  },
  /*开始转盘 */
  onStartTap: function () {
    if (this.data.start) return;
    let t = this;
    if (t.data.frequency == 0) {
      if (t.data.is_vip == 1) {
        wx.showModal({
          title: '提示',
          content: `继续抽奖将会消耗${t.data.dzpSetting.point_lottery_consume}积分`,
          success(result) {
            if (result.confirm) {
              t.requestLottery();
            }
          }
        });
      } else {
        wx.showModal({
          title: '提示',
          content: `您的抽奖机会已经用完了`,
          showCancel: 0
        });
      }
    } else {
      t.requestLottery();
    }

  },
  // 向后台请求抽奖参数
  requestLottery() {
    if (this.data.start) return;
    let t = this;
    let apiObj = dzpApi.lottery;
    apiObj.data.openid = app.globalData.UserInfo.WeiXinOpenId;
    apiObj.complete = function () {
      wx.hideLoading();
    };
    apiObj.success = function (resp) {
      let respData = resp.data;
      console.log(respData);
      if (respData.status != 'success') {
        wx.showModal({
          title: '提示',
          content: respData.msg,
          showCancel: 0,
        });
        return false;
      }
      let prize = respData.data;
      console.log(prize);
      t.setData({prize: prize});
      // 计算抽到的prize在页面数据数组中的下标
      let prizeList = t.data.prizeList;
      let idx = 0;
      for (let i = 0; i < prizeList.length; ++i) {
        if (prizeList[i].id == prize.id) {
          idx = i;
          break;
        }
      }
      // 计算要旋转的角度rotate
      let rotate = -(idx * 60 + 360 * 10);
      t.startSpin(rotate);
      t.loadInfo();
    };
    wx.showLoading({title: '加载中',});
    wx.request(apiObj);
  },
  // 设置旋转参数
  startSpin(rotate) {
    if (this.data.start) return;
    this.setData({
      animationData: {
        duration: 3000,
        timingFunction: 'ease-out',
        rotate: rotate,
      },
      start: true
    });
    setTimeout(this.animation, 3000);
  },
  /*关闭中奖*/
  onSetValueTap: function (e) {
    let dataset = e.currentTarget.dataset;
    let name = dataset.name;
    let value = dataset.value;
    let o = {};
    o[name] = value;
    this.setData(o);
  },
  /*中奖纪录*/
  onNavigateTap: function (e) {
    const dataset = e.detail.target ? e.detail.target.dataset : e.currentTarget.dataset;
    const url = dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  onShareAppMessage(e) {
    let t = this;
    return {
      title: '幸运大转盘',
      path: '/pages/index/index',
      success: function (res) {
        let apiObj = dzpApi.share;
        apiObj.data.openid = app.globalData.UserInfo.WeiXinOpenId;
        apiObj.success = function (resp) {
          t.loadInfo();
        };
        wx.request(apiObj);
      },
      fail: function (res) {
        // 转发失败
      }
    };
  },
  getPhoneNumber: function (e) {
    var apiPhone = indexapi1.AddUserPhone;
    let that = this;
    console.log(that.data);
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      return false;
    }
    wx.request({
      url: decodeDataApi.decodeUserData.url,
      data: Object.assign({}, {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, decodeDataApi.decodeUserData.data),
      method: 'POST',
      dataType: 'json',
      success(resp) {
        let data = resp.data;
        console.log('解密成功', resp.data);
        let phoneNumber = data.phoneNumber;
        console.log(phoneNumber);
        console.log(apiPhone.url);
        console.log(apiPhone.data.wid);
        console.log(app.globalData.UserInfo.WeiXinOpenId);
        console.log(phoneNumber);
        wx.request({
          url: apiPhone.url,
          data: {
            wid: apiPhone.data.wid,
            openid: app.globalData.UserInfo.WeiXinOpenId,
            phonenumber: phoneNumber
          },
          method: 'POST',
          dataType: 'json',
          success: function (res) {
            console.log(res)
            that.onStartTap();
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail() {
        console.log('解密失败');
      }
    });
  },
});
