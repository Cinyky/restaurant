// pages/reserve/reserve.js
var app = getApp(),
  $ = require("../../utils/util.js"),
api = require("../../api/orders.js"),
groupByAPI = require("../../api/groupBuyAPI.js");
var templateMethods = require("../../utils/template_methods.js");
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     list:[],
//     page:1
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     this.setMenu(this);
//     var _this = this,vdata={pageindex:this.data.page}
//     app.globalData.getTop();

//     $.xsr($.makeUrl(api.orderlist, vdata),
//       function (res) {
//         console.log(res);
//         _this.setData({
//           list:res.dataList,
//           page:_this.data.page+1
//         })
//       });
//     var a = wx.getStorageSync('navigation');
//     wx.setNavigationBarColor({
//       frontColor: '#ffffff',
//       backgroundColor: a.selectedColor || '#000'
//     });
//     _this.setData({ __wechat_main_color: a.selectedColor });
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
  
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
    
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {
  
//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {
  
//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {
//     console.log(1)
//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
//     var _this = this, vdata = { pageindex: this.data.page}
//     $.xsr($.makeUrl(api.orderlist, vdata),
//       function (res) {
//         console.log(res);
//         _this.setData({
//           list: _this.data.list.concat(res.dataList),
//           page: _this.data.page + 1
//         })
//       });
//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
  
//   },
//   nav:function(){
//     wx.navigateTo({
//       url: '/pages/log/log',
//     })
//   },
//   ret:function(){
//     wx.reLaunch({
//       url: '/pages/index/index',
//     })
//   },
//   details:function(e){
//     var id = e.currentTarget.dataset.id,
//       pr = e.currentTarget.dataset.praise
//     wx.navigateTo({
//       url: '/pages/details/details?id=' + id + '&pr=' + pr,
//     })
//   }
// })
Page(Object.assign({}, templateMethods,
  {
    /**
    * 页面的初始数据
    */
    data: {
      list: [],
      page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setMenu(this);
      var _this = this, vdata = { pageindex: this.data.page }
      app.globalData.getTop();

      $.xsr($.makeUrl(api.orderlist, vdata),
        function (res) {
          console.log(res);
          _this.setData({
            list: res.dataList,
            page: _this.data.page + 1
          })
        });
      var a = wx.getStorageSync('navigation');
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: a.selectedColor || '#000'
      });
      _this.setData({ __wechat_main_color: a.selectedColor });
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
      console.log(1)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      var _this = this, vdata = { pageindex: this.data.page }
      $.xsr($.makeUrl(api.orderlist, vdata),
        function (res) {
          console.log(res);
          _this.setData({
            list: _this.data.list.concat(res.dataList),
            page: _this.data.page + 1
          })
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    nav: function () {
      wx.navigateTo({
        url: '/pages/log/log',
      })
    },
    ret: function () {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    details: function (e) {
      var id = e.currentTarget.dataset.id,
        pr = e.currentTarget.dataset.praise
      wx.navigateTo({
        url: '/pages/details/details?id=' + id + '&pr=' + pr,
      })
    }
  }));