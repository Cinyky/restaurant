const app = getApp();
const applet_id = app.globalData.applet_id;
var $ = require("../../utils/util.js"),
  api = require("../../api/orders.js")
Page({
  data: {
    // baseUrl: CONFIG.API_URL.URL,
    tabClasss: ["text-select", "text-normal", "text-normal"],
    tab: 0,
    num: ['好评', '一般', '差评'],
    key:'0',
    pageindex:1
  },
  onLoad: function (options) {
    this.loadBanner();
    app.globalData.getTop(); 
  },

  loadBanner: function () {
    // 获取预约信息
    var that = this,
      vdata = { openid: app.globalData.UserInfo.WeiXinOpenId,pageindex:that.data.pageindex}
    $.xsr($.makeUrl(api.reserveSeed,vdata),
      function (res) {
        console.log(res);
        that.setData({
          data: res.dataList,
          pageindex: that.data.pageindex + 1
        })
    })
  },
  // //删除订单
  del:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    let vdata = {id:id}
    $.xsr($.makeUrl(api.cancelOrder, vdata),
      function (res) {
        console.log(res);
        if (res.errcode == 0) {
          wx.showToast({
            title: res.errmsg,
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            let vdata = { openid: app.globalData.UserInfo.WeiXinOpenId, pageindex:that.data.pageindex }
            $.xsr($.makeUrl(api.reserveSeed, vdata),
              function (res) {
                console.log(res);
                that.setData({
                  data: res.dataList,
                })
              })
          }, 1000)
        } else {
          wx.showToast({
            title: res.errmsg,
            icon: 'loading',
            duration: 1000
          })
        }
      })
  },
  /*tab切换*/
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({ tabClasss: classs, tab: index,pageindex:1})
    var url = api.reserveSeed
    switch(index){
        case '0':
        url = api.reserveSeed;
        break;
        case '1':
        url = api.reserveToEvaluated;
        break;
        case '2':
        url = api.reserveExpired;
        break;
    }
    let that = this,vdata = { openid: app.globalData.UserInfo.WeiXinOpenId, pageindex:that.data.pageindex }
    
    $.xsr($.makeUrl(url, vdata),
      function (res) {
        console.log(res);
        that.setData({
          data: res.dataList,
          pageindex: that.data.pageindex + 1
        })
      })
  },
  /*评论*/
  num:function(e){
    var that=this;
    var key = e.detail.value;
    var evaluate = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    let vdata = { id:id,evaluate :evaluate }
    console.log(vdata)
    $.xsr($.makeUrl(api.reserveEvaluated,vdata),
      function (res) {
        if (res.errcode == 0) {
          wx.showToast({
            title: res.errmsg,
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            let vdata = { openid: app.globalData.UserInfo.WeiXinOpenId,pageindex:that.data.pageindex }
            $.xsr($.makeUrl(api.reserveToEvaluated,vdata),
              function (res) {
                console.log(res);
                that.setData({
                  data: res.dataList,
                })
              })
          }, 1000)
        } else {
          wx.showToast({
            title: res.errmsg,
            icon: 'loading',
            duration: 1000
          })
        }
      })
    that.setData({
      key:key
    })
  },
  onReachBottom: function () {
    var url = api.reserveSeed
    switch (index) {
      case '0':
        url = api.reserveSeed;
        break;
      case '1':
        url = api.reserveToEvaluated;
        break;
      case '2':
        url = api.reserveExpired;
        break;
    }
    let vdata = { openid: app.globalData.UserInfo.WeiXinOpenId, pageindex:that.data.pageindex},
      that = this
    $.xsr($.makeUrl(url, vdata),
      function (res) {
        console.log(res);
        that.setData({
          data: that.data.data.concat(res.dataList),
          pageindex: that.data.pageindex + 1
        })
      })
  },
});