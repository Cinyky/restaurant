// pages/winning/winning.js
const app = getApp();
const dzpApi = require('../../api/dzpAPI');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPrize();
  },
  // 加载奖品列表
  loadPrize() {
    let t = this;
    let apiObj = dzpApi.prizeList;
    apiObj.data.openid = app.globalData.UserInfo.WeiXinOpenId;
    apiObj.success = function (result) {
      let respData = result.data;
      console.log(respData);
      let prizeList=respData.data;
      t.setData({prizeList:prizeList});
    };
    wx.request(apiObj);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onCopyTap: function (e) {
    const dataset = e.currentTarget.dataset, data = dataset.data;
    wx.setClipboardData({
      data: data,
      success: (res) => {
        wx.showToast({title: '已复制兑换码',});
      },
    });
  }
});