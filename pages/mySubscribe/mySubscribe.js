var app = getApp(),
  $ = require("../../utils/util.js"),
  api = require("../../api/indexAPI.js"),
  userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, templateMethods, {

  /**
   * 页面的初始数据说
   */
  data: {
    dataList_h:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    let e = {
      openId: app.globalData.UserInfo.WeiXinOpenId
    };
    $.xsr($.makeUrl(userapi.GetYuyueList, e), function (e) {
      t.setData({
        dataList_h : e.dataList
      })
    })
    console.log(t.data);
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

  }
}));
